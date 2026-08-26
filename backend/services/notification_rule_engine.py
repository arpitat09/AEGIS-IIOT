from datetime import datetime
from database.schema import db, NotificationRule, Notification, NotificationDelivery
from workers.notification_worker import enqueue_notification_delivery

DEFAULT_RULES = [
    {
        "name": "P1 Critical Incident Multi-Channel Dispatch",
        "severity_threshold": "CRITICAL",
        "min_risk_score": 80,
        "min_event_count": 1,
        "time_window_seconds": 60,
        "notify_in_app": True,
        "notify_email": True,
        "notify_slack": True,
        "notify_sms": True,
        "escalate_after_minutes": 5,
        "recipient_roles": "SECURITY_ANALYST,SECURITY_ENGINEER,ADMIN",
        "is_active": True
    },
    {
        "name": "High Severity Threat Response",
        "severity_threshold": "HIGH",
        "min_risk_score": 60,
        "min_event_count": 1,
        "time_window_seconds": 60,
        "notify_in_app": True,
        "notify_email": True,
        "notify_slack": True,
        "notify_sms": False,
        "escalate_after_minutes": 10,
        "recipient_roles": "SECURITY_ANALYST,ADMIN",
        "is_active": True
    },
    {
        "name": "Industrial Asset Reconnaissance & Probing",
        "severity_threshold": "MEDIUM",
        "min_risk_score": 40,
        "min_event_count": 1,
        "time_window_seconds": 120,
        "notify_in_app": True,
        "notify_email": True,
        "notify_slack": False,
        "notify_sms": False,
        "escalate_after_minutes": 15,
        "recipient_roles": "SECURITY_ANALYST",
        "is_active": True
    },
    {
        "name": "All Incursion In-App Live Telemetry",
        "severity_threshold": "ALL",
        "min_risk_score": 0,
        "min_event_count": 1,
        "time_window_seconds": 300,
        "notify_in_app": True,
        "notify_email": False,
        "notify_slack": False,
        "notify_sms": False,
        "escalate_after_minutes": 30,
        "recipient_roles": "VIEWER,SECURITY_ANALYST,ADMIN",
        "is_active": True
    }
]

def init_default_notification_rules():
    """Seeds default notification rules if database table is empty."""
    try:
        if NotificationRule.query.count() == 0:
            for item in DEFAULT_RULES:
                rule = NotificationRule(
                    name=item["name"],
                    severity_threshold=item["severity_threshold"],
                    min_risk_score=item["min_risk_score"],
                    min_event_count=item["min_event_count"],
                    time_window_seconds=item["time_window_seconds"],
                    notify_in_app=item["notify_in_app"],
                    notify_email=item["notify_email"],
                    notify_slack=item["notify_slack"],
                    notify_sms=item["notify_sms"],
                    escalate_after_minutes=item["escalate_after_minutes"],
                    recipient_roles=item["recipient_roles"],
                    is_active=item["is_active"],
                    created_at=datetime.utcnow()
                )
                db.session.add(rule)
            db.session.commit()
            print("[NotificationRuleEngine] Default rules initialized.")
    except Exception as e:
        db.session.rollback()
        print(f"[NotificationRuleEngine] Rule init warning: {e}")

def evaluate_and_dispatch_incident_notifications(incident):
    """
    Evaluates active rules against an incident and queues notifications.
    """
    if not incident:
        return

    active_rules = NotificationRule.query.filter_by(is_active=True).all()
    if not active_rules:
        return

    severity_order = {"CRITICAL": 4, "HIGH": 3, "MEDIUM": 2, "LOW": 1, "ALL": 0}
    inc_sev_val = severity_order.get(incident.severity.upper(), 1)

    matching_rules = []
    for rule in active_rules:
        rule_threshold_val = severity_order.get(rule.severity_threshold.upper(), 0)
        
        # Match if rule threshold <= incident severity and risk score >= min_risk_score
        if inc_sev_val >= rule_threshold_val and incident.risk_score >= rule.min_risk_score:
            matching_rules.append(rule)

    if not matching_rules:
        return

    # Consolidate delivery channels across matching rules
    send_in_app = any(r.notify_in_app for r in matching_rules)
    send_email = any(r.notify_email for r in matching_rules)
    send_slack = any(r.notify_slack for r in matching_rules)
    send_sms = any(r.notify_sms for r in matching_rules)

    # Create base Notification record
    notification = Notification(
        incident_id=incident.id,
        title=f"{incident.severity.upper()} {incident.attack_type} Incursion on {incident.affected_asset}",
        message=f"{incident.event_count} events from {incident.source_ip or 'External'} detected. Risk Score: {incident.risk_score}/100. Action: {incident.automatic_action_taken}.",
        severity=incident.severity,
        attack_type=incident.attack_type,
        source_ip=incident.source_ip,
        affected_asset=incident.affected_asset,
        action_taken=incident.automatic_action_taken,
        status="UNREAD",
        created_at=datetime.utcnow()
    )
    db.session.add(notification)
    db.session.commit()

    incident.notification_status = "Dispatched"
    db.session.commit()

    # Enqueue channel deliveries
    if send_in_app:
        delivery = NotificationDelivery(
            notification_id=notification.id,
            incident_id=incident.id,
            channel="IN_APP",
            recipient="SOC_CONSOLE",
            status="DELIVERED",
            delivered_at=datetime.utcnow()
        )
        db.session.add(delivery)
        db.session.commit()

    if send_email:
        delivery = NotificationDelivery(
            notification_id=notification.id,
            incident_id=incident.id,
            channel="EMAIL",
            recipient="soc-team@aegis-iiot.sec",
            status="QUEUED"
        )
        db.session.add(delivery)
        db.session.commit()
        enqueue_notification_delivery(delivery.id)

    if send_slack:
        delivery = NotificationDelivery(
            notification_id=notification.id,
            incident_id=incident.id,
            channel="SLACK",
            recipient="#soc-critical-alerts",
            status="QUEUED"
        )
        db.session.add(delivery)
        db.session.commit()
        enqueue_notification_delivery(delivery.id)

    if send_sms and incident.severity in ["Critical", "High"]:
        delivery = NotificationDelivery(
            notification_id=notification.id,
            incident_id=incident.id,
            channel="SMS",
            recipient="+1-800-SOC-AEGIS",
            status="QUEUED"
        )
        db.session.add(delivery)
        db.session.commit()
        enqueue_notification_delivery(delivery.id)

    # Broadcast over SSE for instant live notification bell trigger
    try:
        from routes.events import broadcast_event
        broadcast_event("new_notification", notification.to_dict())
    except Exception:
        pass
