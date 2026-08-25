from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Alert(db.Model):
    __tablename__ = "alerts"

    id = db.Column(db.Integer, primary_key=True)

    # Detection Information
    attack = db.Column(db.String(50), nullable=False)
    confidence = db.Column(db.Float, nullable=False)
    risk_score = db.Column(db.Integer, nullable=False)
    severity = db.Column(db.String(20), nullable=False)
    action = db.Column(db.String(50), nullable=False)
    anomaly = db.Column(db.Boolean, nullable=False)

    # Real-Time Network Information
    source_ip = db.Column(db.String(50), nullable=True)
    destination_ip = db.Column(db.String(50), nullable=True)
    source_port = db.Column(db.Integer, nullable=True)
    destination_port = db.Column(db.Integer, nullable=True)
    protocol = db.Column(db.String(20), nullable=True)
    service = db.Column(db.String(50), nullable=True)
    packet_count = db.Column(db.Integer, nullable=True)
    total_bytes = db.Column(db.Integer, nullable=True)
    duration = db.Column(db.Float, nullable=True)
    detection_source = db.Column(db.String(30), default="realtime")
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(30), default="Investigating")

    def to_dict(self):
        return {
            "id": self.id,
            "attack": self.attack,
            "confidence": self.confidence,
            "risk_score": self.risk_score,
            "severity": self.severity,
            "action": self.action,
            "anomaly": self.anomaly,
            "status": self.status or ("Blocked" if self.action == "Block IP" else "Investigating"),
            "source_ip": self.source_ip,
            "destination_ip": self.destination_ip,
            "source_port": self.source_port,
            "destination_port": self.destination_port,
            "protocol": self.protocol,
            "service": self.service,
            "packet_count": self.packet_count,
            "total_bytes": self.total_bytes,
            "duration": self.duration,
            "detection_source": self.detection_source,
            "timestamp": self.timestamp.strftime("%Y-%m-%d %H:%M:%S") if self.timestamp else None,
        }


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(30), default="VIEWER", nullable=False)  # ADMIN, SECURITY_ANALYST, VIEWER
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    failed_login_attempts = db.Column(db.Integer, default=0, nullable=False)
    locked_until = db.Column(db.DateTime, nullable=True)
    last_login = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    totp_secret = db.Column(db.String(64), nullable=True)
    mfa_enabled = db.Column(db.Boolean, default=False, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "role": self.role,
            "is_active": self.is_active,
            "last_login": self.last_login.strftime("%Y-%m-%d %H:%M:%S") if self.last_login else None,
            "mfa_enabled": self.mfa_enabled,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S") if self.created_at else None,
        }


class AuditLog(db.Model):
    __tablename__ = "audit_logs"

    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    user_id = db.Column(db.Integer, nullable=True)
    username = db.Column(db.String(80), nullable=True)
    event = db.Column(db.String(100), nullable=False)
    ip_address = db.Column(db.String(50), nullable=True)
    status = db.Column(db.String(30), default="SUCCESS", nullable=False)
    details = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "timestamp": self.timestamp.strftime("%Y-%m-%d %H:%M:%S") if self.timestamp else None,
            "user_id": self.user_id,
            "username": self.username,
            "event": self.event,
            "ip_address": self.ip_address,
            "status": self.status,
            "details": self.details,
        }
