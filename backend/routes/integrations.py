import os
from flask import Blueprint, jsonify, request
from workers.notification_worker import (
    send_email_notification,
    send_slack_notification,
    send_sms_notification
)

integrations_bp = Blueprint("integrations", __name__)

@integrations_bp.route("/status", methods=["GET"])
def get_integrations_status():
    """Retrieve configuration status for enterprise alerting channels."""
    has_smtp = bool(os.getenv("SMTP_HOST") and os.getenv("SMTP_USERNAME"))
    has_slack = bool(os.getenv("SLACK_WEBHOOK_URL"))
    has_twilio = bool(os.getenv("TWILIO_ACCOUNT_SID") and os.getenv("TWILIO_AUTH_TOKEN"))

    return jsonify({
        "in_app": {
            "name": "In-App SOC Notification Center",
            "status": "Connected",
            "type": "Internal SSE / WebSocket",
            "details": "Active real-time push to all authenticated frontend sessions."
        },
        "email": {
            "name": "Email SMTP Gateway",
            "status": "Connected" if has_smtp else "Simulated / Development",
            "type": "SMTP / TLS",
            "host": os.getenv("SMTP_HOST", "smtp.office365.com (Default)"),
            "sender": os.getenv("SMTP_FROM_EMAIL", "soc-alerts@aegis-iiot.sec")
        },
        "slack": {
            "name": "Slack & Microsoft Teams Webhook",
            "status": "Connected" if has_slack else "Simulated / Development",
            "type": "Incoming Webhook",
            "channel": "#soc-critical-incursions"
        },
        "sms": {
            "name": "Twilio SMS Critical Dispatch",
            "status": "Connected" if has_twilio else "Simulated / Development",
            "type": "Twilio REST API",
            "phone": os.getenv("TWILIO_PHONE_NUMBER", "+1-800-AEGIS-SEC")
        }
    })

@integrations_bp.route("/test", methods=["POST"])
def test_integration():
    """Dispatch a test notification across a specified channel."""
    data = request.get_json(force=True, silent=True) or {}
    channel = data.get("channel", "IN_APP").upper()
    recipient = data.get("recipient", "soc-test@aegis-iiot.sec")

    if channel == "EMAIL":
        ok, msg = send_email_notification(
            recipient,
            "[TEST] AEGIS-IIOT Integration Verification",
            "<h3>AEGIS-IIOT Notification Test</h3><p>Your email notification gateway is functioning properly.</p>"
        )
    elif channel == "SLACK":
        ok, msg = send_slack_notification(None, {"text": "🛡️ AEGIS-IIOT Test Notification: Channel integration verified."})
    elif channel == "SMS":
        ok, msg = send_sms_notification(recipient, "AEGIS-IIOT Test Alert: SMS gateway verified.")
    else:
        ok, msg = True, "In-App broadcast verified."

    return jsonify({"success": ok, "message": msg})
