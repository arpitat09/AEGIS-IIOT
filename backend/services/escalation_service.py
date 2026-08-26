import threading
import time
from datetime import datetime, timedelta
from database.schema import db, Incident, AuditLog, Notification
from workers.notification_worker import enqueue_notification_delivery

flask_app_ref = None

def set_escalation_flask_app(app):
    global flask_app_ref
    flask_app_ref = app

def check_incident_escalations():
    """
    Checks active unacknowledged incidents and triggers automatic escalation policies.
    """
    if not flask_app_ref:
        return

    with flask_app_ref.app_context():
        now = datetime.utcnow()
        
        # Check unacknowledged Critical and High incidents
        unack_incidents = Incident.query.filter(
            Incident.status.in_(["NEW"]),
            Incident.acknowledged_at == None
        ).all()

        for inc in unack_incidents:
            age_minutes = (now - inc.first_seen).total_seconds() / 60.0
            
            # Level 1 -> Level 2 Escalation (5 mins for Critical, 10 mins for High)
            if inc.escalation_level == 1:
                threshold = 5 if inc.severity == "Critical" else 10
                if age_minutes >= threshold:
                    inc.escalation_level = 2
                    inc.priority = "P1-Critical"
                    
                    # Audit Log
                    audit = AuditLog(
                        event="INCIDENT_ESCALATED",
                        username="SYSTEM_ESCALATION_DAEMON",
                        status="ESCALATED_LEVEL_2",
                        details=f"Incident {inc.incident_code} unacknowledged after {int(age_minutes)} mins. Escalated to Security Engineer."
                    )
                    db.session.add(audit)

                    # Escalation Notification
                    notif = Notification(
                        incident_id=inc.id,
                        title=f"⚠️ ESCALATION L2: {inc.incident_code} Unacknowledged",
                        message=f"Critical incident on {inc.affected_asset} unacknowledged after {int(age_minutes)} mins. Escalated to Security Engineer.",
                        severity="Critical",
                        attack_type=inc.attack_type,
                        source_ip=inc.source_ip,
                        affected_asset=inc.affected_asset,
                        action_taken="Escalated to L2",
                        status="UNREAD"
                    )
                    db.session.add(notif)
                    db.session.commit()

                    # Broadcast SSE
                    try:
                        from routes.events import broadcast_event
                        broadcast_event("incident_escalated", inc.to_dict())
                        broadcast_event("new_notification", notif.to_dict())
                    except Exception:
                        pass

            # Level 2 -> Level 3 Escalation (10 mins for Critical)
            elif inc.escalation_level == 2 and inc.severity == "Critical":
                if age_minutes >= 10:
                    inc.escalation_level = 3
                    
                    audit = AuditLog(
                        event="INCIDENT_ESCALATED",
                        username="SYSTEM_ESCALATION_DAEMON",
                        status="ESCALATED_LEVEL_3",
                        details=f"Incident {inc.incident_code} unacknowledged after {int(age_minutes)} mins. Escalated to Security Manager."
                    )
                    db.session.add(audit)

                    notif = Notification(
                        incident_id=inc.id,
                        title=f"🚨 EMERGENCY ESCALATION L3: {inc.incident_code}",
                        message=f"Critical incident on {inc.affected_asset} escalated to Security Manager & Emergency Response Contact.",
                        severity="Critical",
                        attack_type=inc.attack_type,
                        source_ip=inc.source_ip,
                        affected_asset=inc.affected_asset,
                        action_taken="Emergency Escalation",
                        status="UNREAD"
                    )
                    db.session.add(notif)
                    db.session.commit()

                    try:
                        from routes.events import broadcast_event
                        broadcast_event("incident_escalated", inc.to_dict())
                        broadcast_event("new_notification", notif.to_dict())
                    except Exception:
                        pass

def escalation_checker_loop():
    """Continuous background loop running every 60 seconds."""
    print("[EscalationService] Background escalation monitor started.")
    while True:
        try:
            check_incident_escalations()
        except Exception as e:
            print(f"[EscalationService] Error checking escalations: {e}")
        time.sleep(60)

def start_escalation_service(app):
    """Starts the background escalation checker daemon thread."""
    set_escalation_flask_app(app)
    t = threading.Thread(target=escalation_checker_loop, daemon=True, name="EscalationServiceThread")
    t.start()
