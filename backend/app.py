import os
import sys

os.environ["PYTHONUNBUFFERED"] = "1"
os.environ["MPLCONFIGDIR"] = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".matplotlib")
os.makedirs(os.environ["MPLCONFIGDIR"], exist_ok=True)

import threading

from flask import Flask
from flask_cors import CORS

from database.schema import db

from routes.detection import detection_bp
from routes.monitoring import monitoring_bp
from routes.analytics import analytics_bp
from routes.reports import reports_bp
from routes.prevention import prevention_bp
from routes.architecture import architecture_bp
from routes.incidents import incidents_bp
from routes.explainability import explainability_bp
from routes.auth import auth_bp
from routes.ingest import ingest_bp
from routes.system import system_bp
from routes.events import events_bp
from routes.dashboard import dashboard_bp
from routes.notifications import notifications_bp
from routes.notification_rules import notification_rules_bp
from routes.assets import assets_bp
from routes.ai import ai_bp
from routes.integrations import integrations_bp

from realtime.packet_capture import start_capture
from workers.notification_worker import start_notification_worker
from services.escalation_service import start_escalation_service
from services.asset_service import init_default_assets
from services.notification_rule_engine import init_default_notification_rules


# ==================================================
# APP CONFIGURATION
# ==================================================

app = Flask(__name__)


# ==================================================
# CORS CONFIGURATION
# ==================================================

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": "*"
        }
    }
)


# ==================================================
# DATABASE CONFIGURATION
# ==================================================

BASE_DIR = os.path.abspath(
    os.path.dirname(__file__)
)

DATABASE_DIR = os.path.join(
    BASE_DIR,
    "database"
)

os.makedirs(
    DATABASE_DIR,
    exist_ok=True
)

DATABASE_PATH = os.path.join(
    DATABASE_DIR,
    "database.db"
)

app.config["SQLALCHEMY_DATABASE_URI"] = (
    f"sqlite:///{DATABASE_PATH}"
)

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "connect_args": {
        "timeout": 30,
        "check_same_thread": False
    }
}


# ==================================================
# INITIALIZE DATABASE
# ==================================================

db.init_app(app)


# ==================================================
# REGISTER BLUEPRINTS
# ==================================================

app.register_blueprint(detection_bp, url_prefix="/api/detection")
app.register_blueprint(monitoring_bp, url_prefix="/api/monitoring")
app.register_blueprint(analytics_bp, url_prefix="/api/analytics")
app.register_blueprint(reports_bp, url_prefix="/api/reports")
app.register_blueprint(prevention_bp, url_prefix="/api/prevention")
app.register_blueprint(architecture_bp, url_prefix="/api/architecture")
app.register_blueprint(incidents_bp, url_prefix="/api/incidents")
app.register_blueprint(explainability_bp, url_prefix="/api/explainability")
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(ingest_bp, url_prefix="/api/ingest")
app.register_blueprint(system_bp, url_prefix="/api/system")
app.register_blueprint(events_bp, url_prefix="/api")
app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")
app.register_blueprint(notifications_bp, url_prefix="/api/notifications")
app.register_blueprint(notification_rules_bp, url_prefix="/api/notification-rules")
app.register_blueprint(assets_bp, url_prefix="/api/assets")
app.register_blueprint(ai_bp, url_prefix="/api/ai")
app.register_blueprint(integrations_bp, url_prefix="/api/integrations")


# ==================================================
# ROOT & HEALTH ROUTES
# ==================================================

@app.route("/")
def home():
    return {
        "status": "AEGIS-IIOT Backend Running",
        "message": "Adaptive Cyber Defense API is operational"
    }


@app.route("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "AEGIS-IIOT Backend"
    }


# ==================================================
# DATABASE SEEDING & SERVICES INITIALIZATION
# ==================================================

with app.app_context():
    # Enable WAL mode for high-concurrency multi-threaded access
    try:
        from sqlalchemy import text
        with db.engine.connect() as conn:
            conn.execute(text("PRAGMA journal_mode=WAL;"))
            conn.execute(text("PRAGMA busy_timeout=30000;"))
            conn.commit()
    except Exception as e:
        print(f"[AEGIS-IIOT] WAL mode setup: {e}")

    db.create_all()

    # Ensure schema migrations for existing SQLite database
    try:
        from sqlalchemy import text
        with db.engine.connect() as conn:
            result = conn.execute(text("PRAGMA table_info(alerts)"))
            cols = [row[1] for row in result.fetchall()]
            if "status" not in cols:
                conn.execute(text("ALTER TABLE alerts ADD COLUMN status VARCHAR(30) DEFAULT 'Investigating'"))
            if "incident_id" not in cols:
                conn.execute(text("ALTER TABLE alerts ADD COLUMN incident_id INTEGER REFERENCES incidents(id)"))
            conn.commit()
    except Exception as e:
        print(f"[AEGIS-IIOT] Schema migration notice: {e}")

    # Initialize default SOC user accounts
    try:
        from services.auth_service import seed_default_users
        seed_default_users()
    except Exception as e:
        print(f"[AEGIS-IIOT] Seed default users notice: {e}")

    # Initialize assets & rules
    init_default_assets()
    init_default_notification_rules()

    # Start notification background worker & escalation monitor
    start_notification_worker(app)
    start_escalation_service(app)


# ==================================================
# START REAL-TIME PACKET CAPTURE
# ==================================================

def start_realtime_capture():
    print("Starting AEGIS-IIOT real-time packet capture...")
    capture_thread = threading.Thread(
        target=start_capture,
        args=(app,),
        daemon=True,
        name="AEGIS-Packet-Capture"
    )
    capture_thread.start()
    print("AEGIS-IIOT real-time capture thread started")


# ==================================================
# RUN APPLICATION
# ==================================================

if __name__ == "__main__":

    start_realtime_capture()


    app.run(

        host="0.0.0.0",

        port=5000,

        debug=False,

        use_reloader=False
    )