import json
from datetime import datetime
from flask import Blueprint, jsonify, request
from sqlalchemy import func, or_
from database.schema import db, Incident, Alert, AuditLog, Asset

incidents_bp = Blueprint("incidents", __name__)

@incidents_bp.route("", methods=["GET"])
@incidents_bp.route("/", methods=["GET"])
def get_incidents():
    """
    Get paginated incidents with filtering by status, severity, attack type, or search term.
    """
    severity = request.args.get("severity")
    attack = request.args.get("attack")
    status = request.args.get("status")
    priority = request.args.get("priority")
    search = request.args.get("search")
    limit = request.args.get("limit", default=50, type=int)
    offset = request.args.get("offset", default=0, type=int)

    query = Incident.query

    if severity and severity != "All" and severity != "ALL":
        query = query.filter(Incident.severity == severity)
    if attack and attack != "All" and attack != "ALL":
        query = query.filter(Incident.attack_type == attack)
    if status and status != "All" and status != "ALL":
        query = query.filter(Incident.status == status.upper())
    if priority and priority != "All" and priority != "ALL":
        query = query.filter(Incident.priority == priority)
    if search:
        pattern = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Incident.incident_code.like(pattern),
                Incident.title.like(pattern),
                Incident.source_ip.like(pattern),
                Incident.destination_ip.like(pattern),
                Incident.affected_asset.like(pattern),
                Incident.attack_type.like(pattern)
            )
        )

    incidents = query.order_by(Incident.last_seen.desc()).offset(offset).limit(limit).all()

    # Fallback to alerts if no incidents exist yet
    if not incidents and Incident.query.count() == 0:
        alerts = Alert.query.filter(Alert.attack != "Normal").order_by(Alert.timestamp.desc()).limit(limit).all()
        return jsonify([
            {
                "id": a.id,
                "incident_code": f"AEGIS-INC-{a.id}",
                "title": f"{a.severity} {a.attack} on {a.destination_ip or 'PLC-02'}",
                "description": f"Incursion detected from {a.source_ip}",
                "severity": a.severity,
                "priority": "P1-Critical" if a.severity == "Critical" else "P2-High",
                "risk_score": a.risk_score,
                "attack_type": a.attack,
                "source_ip": a.source_ip,
                "destination_ip": a.destination_ip,
                "affected_asset": "Industrial PLC-02",
                "event_count": a.packet_count or 1,
                "first_seen": a.timestamp.strftime("%Y-%m-%d %H:%M:%S") if a.timestamp else None,
                "last_seen": a.timestamp.strftime("%Y-%m-%d %H:%M:%S") if a.timestamp else None,
                "duration_seconds": int(a.duration or 0),
                "status": "NEW" if a.status == "Investigating" else a.status.upper(),
                "assigned_analyst": "Unassigned",
                "recommended_action": "Isolate affected device and investigate source IP",
                "automatic_action_taken": a.action,
                "notification_status": "Dispatched",
                "escalation_level": 1,
                "ai_summary": f"AEGIS-IIOT detected {a.attack} incursion from {a.source_ip}. Risk score: {a.risk_score}/100.",
                "ai_recommended_response": "1. Block source IP\n2. Monitor PLC registers",
                "investigation_notes": "Initial alert converted to incident.",
                "timeline_json": "[]"
            }
            for a in alerts
        ])

    return jsonify([inc.to_dict() for inc in incidents])

@incidents_bp.route("/<int:incident_id>", methods=["GET"])
def get_incident_detail(incident_id):
    """Get single incident detail with associated alert telemetry."""
    incident = Incident.query.get(incident_id)
    if not incident:
        # Check Alert table fallback
        alert = Alert.query.get(incident_id)
        if alert:
            return jsonify(alert.to_dict())
        return jsonify({"error": "Incident not found"}), 404

    data = incident.to_dict()
    # Attach recent associated alerts
    alerts = Alert.query.filter_by(incident_id=incident.id).order_by(Alert.timestamp.desc()).limit(20).all()
    data["recent_alerts"] = [a.to_dict() for a in alerts]
    return jsonify(data)

@incidents_bp.route("/<int:incident_id>/acknowledge", methods=["POST"])
def acknowledge_incident(incident_id):
    """Acknowledge incident by SOC analyst."""
    incident = Incident.query.get(incident_id)
    if not incident:
        return jsonify({"error": "Incident not found"}), 404

    data = request.get_json(force=True, silent=True) or {}
    analyst_name = data.get("username", "SOC Analyst")

    incident.status = "ACKNOWLEDGED"
    incident.acknowledged_at = datetime.utcnow()
    incident.acknowledged_by = analyst_name
    incident.assigned_analyst = analyst_name

    # Add to timeline
    try:
        timeline = json.loads(incident.timeline_json or "[]")
        timeline.append({
            "timestamp": datetime.utcnow().strftime("%H:%M:%S"),
            "event": f"Incident acknowledged by {analyst_name}",
            "action": "Acknowledge"
        })
        incident.timeline_json = json.dumps(timeline)
    except Exception:
        pass

    # Audit Log
    audit = AuditLog(
        event="INCIDENT_ACKNOWLEDGED",
        username=analyst_name,
        status="SUCCESS",
        details=f"Acknowledged incident {incident.incident_code}"
    )
    db.session.add(audit)
    db.session.commit()

    return jsonify(incident.to_dict())

@incidents_bp.route("/<int:incident_id>", methods=["PATCH", "PUT"])
@incidents_bp.route("/<int:incident_id>/status", methods=["POST", "PATCH", "PUT"])
def update_incident_status(incident_id):
    """Update incident lifecycle state (NEW, ACKNOWLEDGED, INVESTIGATING, CONTAINED, RESOLVED, CLOSED)."""
    incident = Incident.query.get(incident_id)
    if not incident:
        # Backward compatibility with alert update
        alert = Alert.query.get(incident_id)
        if alert:
            data = request.get_json(force=True, silent=True) or {}
            alert.status = data.get("status", alert.status)
            db.session.commit()
            return jsonify(alert.to_dict())
        return jsonify({"error": "Incident not found"}), 404

    data = request.get_json(force=True, silent=True) or {}
    new_status = data.get("status", incident.status).upper()
    notes = data.get("notes")
    analyst_name = data.get("username", "SOC Analyst")

    old_status = incident.status
    incident.status = new_status
    if notes:
        incident.investigation_notes = (incident.investigation_notes or "") + f"\n[{datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')}] {analyst_name}: {notes}"

    try:
        timeline = json.loads(incident.timeline_json or "[]")
        timeline.append({
            "timestamp": datetime.utcnow().strftime("%H:%M:%S"),
            "event": f"Status updated from {old_status} to {new_status} by {analyst_name}",
            "action": new_status
        })
        incident.timeline_json = json.dumps(timeline)
    except Exception:
        pass

    audit = AuditLog(
        event="INCIDENT_STATUS_CHANGE",
        username=analyst_name,
        status="SUCCESS",
        details=f"Changed {incident.incident_code} from {old_status} to {new_status}"
    )
    db.session.add(audit)
    db.session.commit()

    return jsonify(incident.to_dict())

@incidents_bp.route("/<int:incident_id>/assign", methods=["POST"])
def assign_incident(incident_id):
    """Assign incident to a specific SOC analyst."""
    incident = Incident.query.get(incident_id)
    if not incident:
        return jsonify({"error": "Incident not found"}), 404

    data = request.get_json(force=True, silent=True) or {}
    analyst_name = data.get("assigned_analyst", "Unassigned")
    incident.assigned_analyst = analyst_name
    db.session.commit()
    return jsonify(incident.to_dict())

@incidents_bp.route("/<int:incident_id>/contain", methods=["POST"])
def contain_incident(incident_id):
    """Execute active containment action (Block IP / Isolate Device / Rate Limit)."""
    incident = Incident.query.get(incident_id)
    if not incident:
        return jsonify({"error": "Incident not found"}), 404

    data = request.get_json(force=True, silent=True) or {}
    action = data.get("action", "Block IP")
    analyst_name = data.get("username", "SOC Analyst")

    incident.status = "CONTAINED"
    incident.automatic_action_taken = action

    try:
        timeline = json.loads(incident.timeline_json or "[]")
        timeline.append({
            "timestamp": datetime.utcnow().strftime("%H:%M:%S"),
            "event": f"Containment action '{action}' executed by {analyst_name}",
            "action": action
        })
        incident.timeline_json = json.dumps(timeline)
    except Exception:
        pass

    audit = AuditLog(
        event="CONTAINMENT_EXECUTED",
        username=analyst_name,
        status="SUCCESS",
        details=f"Enforced '{action}' on {incident.incident_code} targeting {incident.source_ip}"
    )
    db.session.add(audit)
    db.session.commit()

    return jsonify(incident.to_dict())

@incidents_bp.route("/summary", methods=["GET"])
def get_incident_summary():
    """Summary statistics for SOC Incident Management Center."""
    total_incidents = Incident.query.count()
    if total_incidents == 0:
        # Derive from Alert counts
        total = Alert.query.count()
        critical = Alert.query.filter(Alert.severity == "Critical").count()
        high = Alert.query.filter(Alert.severity == "High").count()
        medium = Alert.query.filter(Alert.severity == "Medium").count()
        low = Alert.query.filter(Alert.severity == "Low").count()
        return jsonify({
            "total": total,
            "critical": critical,
            "high": high,
            "medium": medium,
            "low": low,
            "new_count": critical + high,
            "acknowledged_count": 0,
            "investigating_count": medium,
            "contained_count": Alert.query.filter(Alert.action == "Block IP").count(),
            "resolved_count": low,
            "closed_count": 0,
            "active_count": critical + high + medium
        })

    critical = Incident.query.filter(Incident.severity == "Critical").count()
    high = Incident.query.filter(Incident.severity == "High").count()
    medium = Incident.query.filter(Incident.severity == "Medium").count()
    low = Incident.query.filter(Incident.severity == "Low").count()

    new_count = Incident.query.filter(Incident.status == "NEW").count()
    acknowledged = Incident.query.filter(Incident.status == "ACKNOWLEDGED").count()
    investigating = Incident.query.filter(Incident.status == "INVESTIGATING").count()
    contained = Incident.query.filter(Incident.status == "CONTAINED").count()
    resolved = Incident.query.filter(Incident.status == "RESOLVED").count()
    closed = Incident.query.filter(Incident.status == "CLOSED").count()

    return jsonify({
        "total": total_incidents,
        "critical": critical,
        "high": high,
        "medium": medium,
        "low": low,
        "new_count": new_count,
        "acknowledged_count": acknowledged,
        "investigating_count": investigating,
        "contained_count": contained,
        "resolved_count": resolved,
        "closed_count": closed,
        "active_count": new_count + acknowledged + investigating
    })
