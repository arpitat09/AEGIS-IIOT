from flask import Flask
from flask_cors import CORS

from config import Config
from database.schema import db

# -----------------------------
# Import Blueprints
# -----------------------------
from routes.ingest import ingest_bp
from routes.detection import detection_bp
from routes.explainability import explainability_bp
from routes.prevention import prevention_bp
from routes.monitoring import monitoring_bp
from routes.reports import reports_bp

# -----------------------------
# Create Flask App
# -----------------------------
app = Flask(__name__)

app.config.from_object(Config)

CORS(app)

# -----------------------------
# Initialize Database
# -----------------------------
db.init_app(app)

with app.app_context():
    db.create_all()

# -----------------------------
# Register Blueprints
# -----------------------------

app.register_blueprint(
    ingest_bp,
    url_prefix="/api/ingest"
)

app.register_blueprint(
    detection_bp,
    url_prefix="/api/detection"
)

app.register_blueprint(
    explainability_bp,
    url_prefix="/api/explainability"
)

app.register_blueprint(
    prevention_bp,
    url_prefix="/api/prevention"
)

app.register_blueprint(
    monitoring_bp,
    url_prefix="/api/monitoring"
)

app.register_blueprint(
    reports_bp,
    url_prefix="/api/reports"
)

# -----------------------------
# Home Route
# -----------------------------
@app.route("/")
def home():
    return {
        "project": "AEGIS-IIOT",
        "status": "Backend Running",
        "version": "1.0",
        "modules": [
            "Ingestion",
            "Detection",
            "Explainability",
            "Prevention",
            "Monitoring",
            "Reports"
        ]
    }

# -----------------------------
# Run Server
# -----------------------------
if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )