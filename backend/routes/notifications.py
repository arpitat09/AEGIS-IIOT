from datetime import datetime
from flask import Blueprint, jsonify, request
from database.schema import db, Notification, NotificationDelivery, Incident, AuditLog

notifications_bp = Blueprint("notifications", __name__)

@notifications_bp.route("", methods=["GET"])
@notifications_bp.route("/", methods=["GET"])
def get_notifications():
    """Retrieve notifications with optional severity or status filtering."""
    status = request.args.get("status")
    severity = request.args.get("severity")
    limit = request.args.get("limit", default=50, type=int)
    offset = request.args.get("offset", default=0, type=int)

    query = Notification.query

    if status and status != "ALL":
        query = query.filter(Notification.status == status.upper())
    if severity and severity != "ALL":
        query = query.filter(Notification.severity == severity)

    notifs = query.order_by(Notification.created_at.desc()).offset(offset).limit(limit).all()
    return jsonify([n.to_dict() for n in notifs])

@notifications_bp.route("/unread-count", methods=["GET"])
def get_unread_count():
    """Get unread and critical notification counts for real-time header bell badge."""
    unread_count = Notification.query.filter(Notification.status == "UNREAD").count()
    critical_count = Notification.query.filter(
        Notification.status == "UNREAD",
        Notification.severity.in_(["Critical", "High"])
    ).count()

    return jsonify({
        "unread_count": unread_count,
        "critical_count": critical_count
    })

@notifications_bp.route("/<int:notification_id>/read", methods=["POST"])
def mark_notification_read(notification_id):
    """Mark single notification as READ."""
    notif = Notification.query.get(notification_id)
    if not notif:
        return jsonify({"error": "Notification not found"}), 404

    notif.status = "READ"
    notif.read_at = datetime.utcnow()
    db.session.commit()
    return jsonify(notif.to_dict())

@notifications_bp.route("/read-all", methods=["POST"])
def mark_all_notifications_read():
    """Mark all unread notifications as READ."""
    now = datetime.utcnow()
    unread_notifs = Notification.query.filter(Notification.status == "UNREAD").all()
    for n in unread_notifs:
        n.status = "READ"
        n.read_at = now
    db.session.commit()
    return jsonify({"success": True, "marked_count": len(unread_notifs)})

@notifications_bp.route("/<int:notification_id>/acknowledge", methods=["POST"])
def acknowledge_notification(notification_id):
    """Acknowledge notification and sync acknowledgment to associated incident."""
    data = request.get_json(force=True, silent=True) or {}
    analyst_name = data.get("username", "SOC Analyst")

    notif = Notification.query.get(notification_id)
    if not notif:
        return jsonify({"error": "Notification not found"}), 404

    notif.status = "ACKNOWLEDGED"
    notif.acknowledged_at = datetime.utcnow()
    notif.acknowledged_by = analyst_name

    # Acknowledge incident if linked
    if notif.incident_id:
        incident = Incident.query.get(notif.incident_id)
        if incident:
            if incident.status == "NEW":
                incident.status = "ACKNOWLEDGED"
            incident.acknowledged_at = datetime.utcnow()
            incident.acknowledged_by = analyst_name

    # Audit Log
    audit = AuditLog(
        event="NOTIFICATION_ACKNOWLEDGED",
        username=analyst_name,
        status="SUCCESS",
        details=f"Acknowledged notification #{notif.id} ({notif.title})"
    )
    db.session.add(audit)
    db.session.commit()

    return jsonify(notif.to_dict())

@notifications_bp.route("/deliveries", methods=["GET"])
def get_notification_deliveries():
    """Get delivery audit history across all channels (In-App, Email, Slack, SMS)."""
    limit = request.args.get("limit", default=100, type=int)
    deliveries = NotificationDelivery.query.order_by(NotificationDelivery.created_at.desc()).limit(limit).all()
    return jsonify([d.to_dict() for d in deliveries])
