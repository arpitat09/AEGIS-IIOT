from flask import Blueprint, jsonify, request
from sqlalchemy import func, or_
from database.schema import db, Alert

incidents_bp = Blueprint("incidents", __name__)


@incidents_bp.route("", methods=["GET"])
@incidents_bp.route("/", methods=["GET"])
def get_incidents():
    """
    Get list of incidents with optional filtering by status, severity, attack, action, and search text.
    """
    severity = request.args.get("severity")
    attack = request.args.get("attack")
    action = request.args.get("action")
    status = request.args.get("status")
    search = request.args.get("search")
    limit = request.args.get("limit", default=100, type=int)
    offset = request.args.get("offset", default=0, type=int)

    query = Alert.query

    if severity and severity != "All":
        query = query.filter(Alert.severity == severity)
    if attack and attack != "All":
        query = query.filter(Alert.attack == attack)
    if action and action != "All":
        query = query.filter(Alert.action == action)
    if status and status != "All":
        query = query.filter(Alert.status == status)
    if search:
        search_pattern = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Alert.source_ip.like(search_pattern),
                Alert.destination_ip.like(search_pattern),
                Alert.attack.like(search_pattern),
                Alert.protocol.like(search_pattern),
                Alert.action.like(search_pattern)
            )
        )

    alerts = query.order_by(Alert.timestamp.desc()).offset(offset).limit(limit).all()
    return jsonify([alert.to_dict() for alert in alerts])


@incidents_bp.route("/<int:incident_id>", methods=["GET"])
def get_incident(incident_id):
    """
    Get detailed incident forensic telemetry by ID.
    """
    alert = Alert.query.get(incident_id)
    if not alert:
        return jsonify({"error": "Incident not found"}), 404
    return jsonify(alert.to_dict())


@incidents_bp.route("/<int:incident_id>", methods=["PATCH", "PUT"])
def update_incident(incident_id):
    """
    Update incident status, action, assigned analyst, or resolution notes.
    """
    alert = Alert.query.get(incident_id)
    if not alert:
        return jsonify({"error": "Incident not found"}), 404

    data = request.get_json(force=True, silent=True) or {}
    if "status" in data:
        alert.status = data["status"]
    if "action" in data:
        alert.action = data["action"]

    db.session.commit()
    return jsonify(alert.to_dict())


@incidents_bp.route("/summary", methods=["GET"])
def get_incident_summary():
    """
    Get summary statistics for SOC incidents.
    """
    total = Alert.query.count()
    critical = Alert.query.filter(Alert.severity == "Critical").count()
    high = Alert.query.filter(Alert.severity == "High").count()
    medium = Alert.query.filter(Alert.severity == "Medium").count()
    low = Alert.query.filter(Alert.severity == "Low").count()
    
    # Status Counts
    open_count = Alert.query.filter(or_(Alert.status == "Open", Alert.status == None)).count()
    investigating = Alert.query.filter(Alert.status == "Investigating").count()
    contained = Alert.query.filter(Alert.status == "Contained").count()
    resolved = Alert.query.filter(Alert.status == "Resolved").count()
    false_positive = Alert.query.filter(Alert.status == "False Positive").count()
    blocked = Alert.query.filter(Alert.action == "Block IP").count()

    return jsonify({
        "total": total,
        "critical": critical,
        "high": high,
        "medium": medium,
        "low": low,
        "open": open_count,
        "investigating": investigating,
        "contained": contained,
        "resolved": resolved,
        "false_positive": false_positive,
        "blocked": blocked
    })
