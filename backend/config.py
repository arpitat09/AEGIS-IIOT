import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))


class Config:
    SECRET_KEY = "aegisiiot"

    UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")

    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(
        BASE_DIR,
        "database",
        "database.db"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False


# =====================================================
# Risk Engine Configuration
# =====================================================

SEVERITY_BASE_MAP = {
    "DoS": "High",
    "Probe": "Medium",
    "R2L": "High",
    "U2R": "Critical",
}

ACTION_MAP = {
    "Low": "Alert",
    "Medium": "Rate Limit",
    "High": "Terminate Session",
    "Critical": "Block IP",
}