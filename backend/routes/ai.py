from flask import Blueprint, jsonify, request
from services.ai_incident_service import (
    query_ai_soc_copilot,
    generate_ai_security_insights,
    generate_ai_incident_summary,
    generate_ai_recommended_response
)
from database.schema import Incident, db

ai_bp = Blueprint("ai", __name__)

@ai_bp.route("/copilot", methods=["POST"])
def copilot_query():
    """Interactive SOC Copilot answering natural language queries with live telemetry."""
    data = request.get_json(force=True, silent=True) or {}
    query_text = data.get("query", "")
    user_role = data.get("role", "SECURITY_ANALYST")
    
    response = query_ai_soc_copilot(query_text, user_role)
    return jsonify(response)

@ai_bp.route("/insights", methods=["GET"])
def get_insights():
    """Calculated AI security insights and incursion trends."""
    insights = generate_ai_security_insights()
    return jsonify(insights)

@ai_bp.route("/incident-summary/<int:incident_id>", methods=["POST"])
def regenerate_summary(incident_id):
    """Regenerate AI incident summary on demand."""
    incident = Incident.query.get(incident_id)
    if not incident:
        return jsonify({"error": "Incident not found"}), 404

    summary = generate_ai_incident_summary(
        attack_type=incident.attack_type,
        severity=incident.severity,
        risk_score=incident.risk_score,
        source_ip=incident.source_ip,
        destination_ip=incident.destination_ip,
        affected_asset=incident.affected_asset,
        event_count=incident.event_count,
        duration_seconds=incident.duration_seconds,
        action=incident.automatic_action_taken
    )
    incident.ai_summary = summary
    db.session.commit()
    return jsonify({"ai_summary": summary})
