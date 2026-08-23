from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


class Alert(db.Model):
    __tablename__ = "alerts"

    id = db.Column(db.Integer, primary_key=True)

    attack = db.Column(db.String(50), nullable=False)

    confidence = db.Column(db.Float, nullable=False)

    risk_score = db.Column(db.Integer, nullable=False)

    severity = db.Column(db.String(20), nullable=False)

    action = db.Column(db.String(50), nullable=False)

    anomaly = db.Column(db.Boolean, nullable=False)

    timestamp = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    def to_dict(self):
        return {
            "id": self.id,
            "attack": self.attack,
            "confidence": self.confidence,
            "risk_score": self.risk_score,
            "severity": self.severity,
            "action": self.action,
            "anomaly": self.anomaly,
            "timestamp": self.timestamp.strftime("%Y-%m-%d %H:%M:%S")
        }