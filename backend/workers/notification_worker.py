import json
import os
import queue
import smtplib
import threading
import time
import urllib.request
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# Thread-safe task queue for asynchronous notification deliveries
NOTIFICATION_QUEUE = queue.Queue(maxsize=1000)

flask_app_ref = None

def set_worker_flask_app(app):
    global flask_app_ref
    flask_app_ref = app

def enqueue_notification_delivery(delivery_id):
    """Adds a NotificationDelivery record ID to the background processing queue."""
    try:
        NOTIFICATION_QUEUE.put_nowait(delivery_id)
    except queue.Full:
        print("[NotificationWorker] Queue is full! Dropping delivery task:", delivery_id)

def send_email_notification(recipient, subject, body_html):
    """Sends email via SMTP using environment variables with graceful fallback."""
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USERNAME")
    smtp_pass = os.getenv("SMTP_PASSWORD")
    smtp_from = os.getenv("SMTP_FROM_EMAIL", "soc-alerts@aegis-iiot.sec")

    if not smtp_host or not smtp_user or not smtp_pass:
        # Development mode simulation
        return True, "Simulated (SMTP not configured in environment variables)"

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = smtp_from
        msg["To"] = recipient
        msg.attach(MIMEText(body_html, "html"))

        with smtplib.SMTP(smtp_host, smtp_port, timeout=10) as server:
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.sendmail(smtp_from, [recipient], msg.as_string())
        return True, "Sent successfully via SMTP"
    except Exception as e:
        return False, f"SMTP error: {str(e)}"

def send_slack_notification(webhook_url, payload_dict):
    """Sends webhook payload to Slack / Teams channel with graceful fallback."""
    url = webhook_url or os.getenv("SLACK_WEBHOOK_URL")
    if not url:
        return True, "Simulated (SLACK_WEBHOOK_URL not configured)"

    try:
        data = json.dumps(payload_dict).encode("utf-8")
        req = urllib.request.Request(
            url,
            data=data,
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            if resp.status == 200:
                return True, "Delivered to Slack channel"
            return False, f"Slack returned HTTP {resp.status}"
    except Exception as e:
        return False, f"Slack webhook error: {str(e)}"

def send_sms_notification(phone_number, message_text):
    """Sends SMS via Twilio using environment variables with graceful fallback."""
    account_sid = os.getenv("TWILIO_ACCOUNT_SID")
    auth_token = os.getenv("TWILIO_AUTH_TOKEN")
    from_phone = os.getenv("TWILIO_PHONE_NUMBER")

    if not account_sid or not auth_token or not from_phone:
        return True, "Simulated (Twilio credentials not configured in environment)"

    try:
        import base64
        import urllib.parse
        
        url = f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json"
        data = urllib.parse.urlencode({
            "To": phone_number,
            "From": from_phone,
            "Body": message_text
        }).encode("utf-8")
        
        auth_header = "Basic " + base64.b64encode(f"{account_sid}:{auth_token}".encode("utf-8")).decode("utf-8")
        req = urllib.request.Request(
            url,
            data=data,
            headers={"Authorization": auth_header, "Content-Type": "application/x-www-form-urlencoded"},
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            if resp.status in [200, 201]:
                return True, "SMS delivered via Twilio"
            return False, f"Twilio returned HTTP {resp.status}"
    except Exception as e:
        return False, f"SMS gateway error: {str(e)}"

def process_notification_delivery(delivery_id):
    """Executes channel delivery for a specific NotificationDelivery database row."""
    if not flask_app_ref:
        return

    with flask_app_ref.app_context():
        from database.schema import db, NotificationDelivery, Notification, Incident
        
        delivery = NotificationDelivery.query.get(delivery_id)
        if not delivery:
            return

        delivery.status = "PROCESSING"
        db.session.commit()

        notification = Notification.query.get(delivery.notification_id)
        incident = Incident.query.get(delivery.incident_id) if delivery.incident_id else None

        channel = delivery.channel.upper()
        success = False
        message = ""

        if channel == "IN_APP":
            delivery.status = "DELIVERED"
            delivery.delivered_at = datetime.utcnow()
            db.session.commit()
            return

        elif channel == "EMAIL":
            subject = f"[{notification.severity.upper() if notification else 'ALERT'}] AEGIS-IIOT Security Incident: {incident.title if incident else 'Incursion Detected'}"
            body_html = f"""
            <html>
            <body style="font-family: Arial, sans-serif; background-color: #0F172A; color: #F8FAFC; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #1E293B; border-radius: 8px; padding: 24px; border: 1px solid #334155;">
                    <h2 style="color: #0D9488; margin-top: 0;">🛡️ AEGIS-IIOT Critical Security Alert</h2>
                    <p style="font-size: 16px;"><b>Incident:</b> {incident.incident_code if incident else 'AEGIS-INC'} — {notification.title if notification else 'Security Event'}</p>
                    <div style="background-color: #0F172A; padding: 15px; border-radius: 6px; margin: 15px 0;">
                        <p style="margin: 5px 0;"><b>Severity:</b> <span style="color: #DC2626;">{notification.severity if notification else 'High'}</span></p>
                        <p style="margin: 5px 0;"><b>Target Asset:</b> {notification.affected_asset if notification else 'Industrial PLC'}</p>
                        <p style="margin: 5px 0;"><b>Source IP:</b> {notification.source_ip if notification else 'Adversary'}</p>
                        <p style="margin: 5px 0;"><b>Action Taken:</b> {notification.action_taken if notification else 'Monitored'}</p>
                    </div>
                    <p style="color: #94A3B8;">Please log in to the AEGIS-IIOT SOC Dashboard to acknowledge and triage this incident.</p>
                </div>
            </body>
            </html>
            """
            success, message = send_email_notification(delivery.recipient, subject, body_html)

        elif channel == "SLACK":
            slack_payload = {
                "text": f"🚨 *AEGIS-IIOT SECURITY ALERT [{notification.severity.upper() if notification else 'HIGH'}]*\n"
                        f"*Incident:* {incident.incident_code if incident else 'N/A'} - {notification.title if notification else 'Incursion'}\n"
                        f"*Target:* {notification.affected_asset if notification else 'PLC-02'} | *Source:* `{notification.source_ip if notification else 'N/A'}`\n"
                        f"*Action:* `{notification.action_taken if notification else 'Contained'}`"
            }
            success, message = send_slack_notification(None, slack_payload)

        elif channel == "SMS":
            sms_text = (
                f"AEGIS-IIOT ALERT: {notification.severity.upper() if notification else 'CRITICAL'} threat on "
                f"{notification.affected_asset if notification else 'PLC'}. Action: {notification.action_taken if notification else 'Blocked'}. "
                f"Incident: {incident.incident_code if incident else 'INC'}"
            )
            success, message = send_sms_notification(delivery.recipient, sms_text)

        else:
            success = True
            message = "Unknown channel simulated"

        if success:
            delivery.status = "DELIVERED"
            delivery.delivered_at = datetime.utcnow()
            delivery.sent_at = datetime.utcnow()
            delivery.failure_reason = message
        else:
            delivery.retry_count += 1
            if delivery.retry_count >= 3:
                delivery.status = "FAILED"
            else:
                delivery.status = "QUEUED"
            delivery.failure_reason = message

        db.session.commit()

def notification_worker_loop():
    """Worker daemon thread that continuously dequeues and delivers notifications."""
    print("[NotificationWorker] Background notification dispatch worker started.")
    while True:
        try:
            delivery_id = NOTIFICATION_QUEUE.get(timeout=1.0)
            process_notification_delivery(delivery_id)
            NOTIFICATION_QUEUE.task_done()
        except queue.Empty:
            continue
        except Exception as e:
            print(f"[NotificationWorker] Error processing delivery: {e}")
            time.sleep(1)

def start_notification_worker(app):
    """Starts the background worker thread."""
    set_worker_flask_app(app)
    t = threading.Thread(target=notification_worker_loop, daemon=True, name="NotificationWorkerThread")
    t.start()
