import json
import random
from datetime import datetime, timedelta
from database.schema import db, Alert, Incident, Asset
from services.asset_service import get_asset_by_ip, calculate_asset_weighted_risk
from services.ai_incident_service import generate_ai_incident_summary, generate_ai_recommended_response
from services.notification_rule_engine import evaluate_and_dispatch_incident_notifications

CORRELATION_WINDOW_SECONDS = 120  # 2-minute sliding window

def correlate_alert_to_incident(alert):
    """
    Correlates an incoming Alert into a deduplicated Incident.
    If a matching active incident exists within the time window, updates it.
    Otherwise, provisions a new Incident with AI summary and triggers notification rules.
    """
    if not alert or alert.attack == "Normal":
        return None

    # Resolve destination asset
    asset = get_asset_by_ip(alert.destination_ip)
    asset_name = asset.name if asset else f"Industrial Asset ({alert.destination_ip or 'Node'})"
    asset_crit = asset.criticality if asset else "MEDIUM"

    if asset:
        asset.threat_count = (asset.threat_count or 0) + 1
        asset.last_seen = datetime.utcnow()

    # Calculate asset-aware risk score
    adjusted_risk = calculate_asset_weighted_risk(alert.risk_score, asset_crit)

    # Search for active incident matching attack vector within correlation window
    window_cutoff = datetime.utcnow() - timedelta(seconds=CORRELATION_WINDOW_SECONDS)
    
    active_incident = Incident.query.filter(
        Incident.attack_type == alert.attack,
        Incident.source_ip == alert.source_ip,
        Incident.destination_ip == alert.destination_ip,
        Incident.status.in_(["NEW", "ACKNOWLEDGED", "INVESTIGATING"]),
        Incident.last_seen >= window_cutoff
    ).first()

    if active_incident:
        # Deduplicate & Update existing active incident
        active_incident.event_count += 1
        active_incident.last_seen = datetime.utcnow()
        active_incident.duration_seconds = max(1, int((active_incident.last_seen - active_incident.first_seen).total_seconds()))
        active_incident.risk_score = max(active_incident.risk_score, adjusted_risk)
        
        # Upgrade severity if incoming alert is higher
        if alert.severity == "Critical" and active_incident.severity != "Critical":
            active_incident.severity = "Critical"
            active_incident.priority = "P1-Critical"
        
        # Append timeline entry
        try:
            timeline = json.loads(active_incident.timeline_json or "[]")
            if len(timeline) < 20:
                timeline.append({
                    "timestamp": datetime.utcnow().strftime("%H:%M:%S"),
                    "event": f"Burst event #{active_incident.event_count} received ({alert.service or 'tcp'})",
                    "action": alert.action
                })
                active_incident.timeline_json = json.dumps(timeline)
        except Exception:
            pass

        alert.incident_id = active_incident.id
        db.session.commit()

        # Re-dispatch notifications on surge thresholds
        if active_incident.event_count in [10, 25, 50, 100]:
            evaluate_and_dispatch_incident_notifications(active_incident)

        # Broadcast update over SSE
        try:
            from routes.events import broadcast_event
            broadcast_event("incident_updated", active_incident.to_dict())
        except Exception:
            pass

        return active_incident

    else:
        # Create New Incident
        inc_number = random.randint(1000, 9999)
        incident_code = f"AEGIS-INC-{inc_number}"
        
        priority_map = {
            "Critical": "P1-Critical",
            "High": "P2-High",
            "Medium": "P3-Medium",
            "Low": "P4-Low"
        }
        priority = priority_map.get(alert.severity, "P2-High")

        initial_timeline = [
            {
                "timestamp": datetime.utcnow().strftime("%H:%M:%S"),
                "event": f"Initial {alert.attack} incursion detected from {alert.source_ip or 'External'}",
                "action": alert.action
            }
        ]

        ai_summary = generate_ai_incident_summary(
            attack_type=alert.attack,
            severity=alert.severity,
            risk_score=adjusted_risk,
            source_ip=alert.source_ip,
            destination_ip=alert.destination_ip,
            affected_asset=asset_name,
            event_count=1,
            duration_seconds=0,
            action=alert.action
        )

        ai_response = generate_ai_recommended_response(
            attack_type=alert.attack,
            severity=alert.severity,
            affected_asset=asset_name,
            source_ip=alert.source_ip or "Adversary"
        )

        incident = Incident(
            incident_code=incident_code,
            title=f"Repeated {alert.attack} Attack on {asset_name}",
            description=f"{alert.severity} incursion sequence from {alert.source_ip or 'External'} targeting {asset_name} ({alert.destination_ip or 'Internal'}).",
            severity=alert.severity,
            priority=priority,
            risk_score=adjusted_risk,
            attack_type=alert.attack,
            source_ip=alert.source_ip,
            destination_ip=alert.destination_ip,
            affected_asset=asset_name,
            event_count=1,
            first_seen=datetime.utcnow(),
            last_seen=datetime.utcnow(),
            duration_seconds=0,
            status="NEW",
            assigned_analyst="Unassigned",
            recommended_action=f"Isolate {asset_name} and enforce firewall containment on {alert.source_ip or 'source IP'}",
            automatic_action_taken=alert.action or "Monitored",
            notification_status="Queued",
            escalation_level=1,
            ai_summary=ai_summary,
            ai_recommended_response=ai_response,
            investigation_notes="Incident created by AEGIS-IIOT Correlation Engine.",
            timeline_json=json.dumps(initial_timeline),
            created_at=datetime.utcnow()
        )
        db.session.add(incident)
        db.session.commit()

        alert.incident_id = incident.id
        db.session.commit()

        # Trigger notification rule evaluation
        evaluate_and_dispatch_incident_notifications(incident)

        # Broadcast new incident over SSE
        try:
            from routes.events import broadcast_event
            broadcast_event("new_incident", incident.to_dict())
        except Exception:
            pass

        return incident
