from datetime import datetime
from flask import Blueprint, jsonify, request
from database.schema import db, NotificationRule, AuditLog

notification_rules_bp = Blueprint("notification_rules", __name__)

@notification_rules_bp.route("", methods=["GET"])
@notification_rules_bp.route("/", methods=["GET"])
def get_rules():
    """List all configured notification & escalation rules."""
    rules = NotificationRule.query.order_by(NotificationRule.id.asc()).all()
    return jsonify([r.to_dict() for r in rules])

@notification_rules_bp.route("", methods=["POST"])
@notification_rules_bp.route("/", methods=["POST"])
def create_rule():
    """Create a new notification rule."""
    data = request.get_json(force=True, silent=True) or {}
    name = data.get("name", "Custom Security Policy")
    
    rule = NotificationRule(
        name=name,
        severity_threshold=data.get("severity_threshold", "HIGH"),
        min_risk_score=int(data.get("min_risk_score", 70)),
        min_event_count=int(data.get("min_event_count", 1)),
        time_window_seconds=int(data.get("time_window_seconds", 60)),
        notify_in_app=bool(data.get("notify_in_app", True)),
        notify_email=bool(data.get("notify_email", False)),
        notify_slack=bool(data.get("notify_slack", False)),
        notify_sms=bool(data.get("notify_sms", False)),
        escalate_after_minutes=int(data.get("escalate_after_minutes", 5)),
        recipient_roles=data.get("recipient_roles", "SECURITY_ANALYST,ADMIN"),
        is_active=bool(data.get("is_active", True)),
        created_at=datetime.utcnow()
    )
    db.session.add(rule)
    db.session.commit()

    audit = AuditLog(
        event="NOTIFICATION_RULE_CREATED",
        username=data.get("username", "SOC Admin"),
        status="SUCCESS",
        details=f"Created notification rule '{rule.name}'"
    )
    db.session.add(audit)
    db.session.commit()

    return jsonify(rule.to_dict()), 201

@notification_rules_bp.route("/<int:rule_id>", methods=["PUT", "PATCH"])
def update_rule(rule_id):
    """Update existing notification rule properties."""
    rule = NotificationRule.query.get(rule_id)
    if not rule:
        return jsonify({"error": "Rule not found"}), 404

    data = request.get_json(force=True, silent=True) or {}
    if "name" in data:
        rule.name = data["name"]
    if "severity_threshold" in data:
        rule.severity_threshold = data["severity_threshold"]
    if "min_risk_score" in data:
        rule.min_risk_score = int(data["min_risk_score"])
    if "min_event_count" in data:
        rule.min_event_count = int(data["min_event_count"])
    if "notify_in_app" in data:
        rule.notify_in_app = bool(data["notify_in_app"])
    if "notify_email" in data:
        rule.notify_email = bool(data["notify_email"])
    if "notify_slack" in data:
        rule.notify_slack = bool(data["notify_slack"])
    if "notify_sms" in data:
        rule.notify_sms = bool(data["notify_sms"])
    if "escalate_after_minutes" in data:
        rule.escalate_after_minutes = int(data["escalate_after_minutes"])
    if "is_active" in data:
        rule.is_active = bool(data["is_active"])

    db.session.commit()
    return jsonify(rule.to_dict())

@notification_rules_bp.route("/<int:rule_id>", methods=["DELETE"])
def delete_rule(rule_id):
    """Delete a notification rule."""
    rule = NotificationRule.query.get(rule_id)
    if not rule:
        return jsonify({"error": "Rule not found"}), 404

    db.session.delete(rule)
    db.session.commit()
    return jsonify({"success": True, "deleted_id": rule_id})
