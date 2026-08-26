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
    incident_id = db.Column(db.Integer, db.ForeignKey("incidents.id", ondelete="SET NULL"), nullable=True)

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
            "incident_id": self.incident_id,
        }


class Incident(db.Model):
    __tablename__ = "incidents"

    id = db.Column(db.Integer, primary_key=True)
    incident_code = db.Column(db.String(50), unique=True, nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    severity = db.Column(db.String(20), default="High", nullable=False)  # Critical, High, Medium, Low
    priority = db.Column(db.String(20), default="P2-High", nullable=False)  # P1-Critical, P2-High, P3-Medium, P4-Low
    risk_score = db.Column(db.Integer, default=75, nullable=False)
    attack_type = db.Column(db.String(50), nullable=False)
    source_ip = db.Column(db.String(50), nullable=True)
    destination_ip = db.Column(db.String(50), nullable=True)
    affected_asset = db.Column(db.String(100), default="Industrial PLC-02", nullable=False)
    event_count = db.Column(db.Integer, default=1, nullable=False)
    first_seen = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    last_seen = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    duration_seconds = db.Column(db.Integer, default=0, nullable=False)
    status = db.Column(db.String(30), default="NEW", nullable=False)  # NEW, ACKNOWLEDGED, INVESTIGATING, CONTAINED, RESOLVED, CLOSED
    assigned_analyst = db.Column(db.String(80), default="Unassigned", nullable=False)
    recommended_action = db.Column(db.String(255), default="Isolate affected device and investigate source IP", nullable=False)
    automatic_action_taken = db.Column(db.String(100), default="Monitored", nullable=False)
    notification_status = db.Column(db.String(30), default="Pending", nullable=False)
    acknowledged_at = db.Column(db.DateTime, nullable=True)
    acknowledged_by = db.Column(db.String(80), nullable=True)
    escalation_level = db.Column(db.Integer, default=1, nullable=False)  # 1: Analyst, 2: Engineer, 3: Manager
    ai_summary = db.Column(db.Text, nullable=True)
    ai_recommended_response = db.Column(db.Text, nullable=True)
    investigation_notes = db.Column(db.Text, nullable=True)
    timeline_json = db.Column(db.Text, default="[]", nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    alerts = db.relationship("Alert", backref="incident", lazy="dynamic")
    notifications = db.relationship("Notification", backref="incident", cascade="all, delete-orphan", lazy="dynamic")

    def to_dict(self):
        return {
            "id": self.id,
            "incident_code": self.incident_code,
            "title": self.title,
            "description": self.description,
            "severity": self.severity,
            "priority": self.priority,
            "risk_score": self.risk_score,
            "attack_type": self.attack_type,
            "source_ip": self.source_ip,
            "destination_ip": self.destination_ip,
            "affected_asset": self.affected_asset,
            "event_count": self.event_count,
            "first_seen": self.first_seen.strftime("%Y-%m-%d %H:%M:%S") if self.first_seen else None,
            "last_seen": self.last_seen.strftime("%Y-%m-%d %H:%M:%S") if self.last_seen else None,
            "duration_seconds": self.duration_seconds,
            "status": self.status,
            "assigned_analyst": self.assigned_analyst,
            "recommended_action": self.recommended_action,
            "automatic_action_taken": self.automatic_action_taken,
            "notification_status": self.notification_status,
            "acknowledged_at": self.acknowledged_at.strftime("%Y-%m-%d %H:%M:%S") if self.acknowledged_at else None,
            "acknowledged_by": self.acknowledged_by,
            "escalation_level": self.escalation_level,
            "ai_summary": self.ai_summary,
            "ai_recommended_response": self.ai_recommended_response,
            "investigation_notes": self.investigation_notes,
            "timeline_json": self.timeline_json,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S") if self.created_at else None,
            "updated_at": self.updated_at.strftime("%Y-%m-%d %H:%M:%S") if self.updated_at else None,
        }


class Notification(db.Model):
    __tablename__ = "notifications"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=True)  # Nullable for broadcast to all SOC analysts
    incident_id = db.Column(db.Integer, db.ForeignKey("incidents.id", ondelete="CASCADE"), nullable=True)
    title = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    severity = db.Column(db.String(20), default="High", nullable=False)
    attack_type = db.Column(db.String(50), nullable=True)
    source_ip = db.Column(db.String(50), nullable=True)
    affected_asset = db.Column(db.String(100), default="Industrial PLC-02", nullable=True)
    action_taken = db.Column(db.String(100), default="Monitored", nullable=True)
    status = db.Column(db.String(20), default="UNREAD", nullable=False)  # UNREAD, READ, ACKNOWLEDGED
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    read_at = db.Column(db.DateTime, nullable=True)
    acknowledged_at = db.Column(db.DateTime, nullable=True)
    acknowledged_by = db.Column(db.String(80), nullable=True)

    deliveries = db.relationship("NotificationDelivery", backref="notification", cascade="all, delete-orphan", lazy="dynamic")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "incident_id": self.incident_id,
            "title": self.title,
            "message": self.message,
            "severity": self.severity,
            "attack_type": self.attack_type,
            "source_ip": self.source_ip,
            "affected_asset": self.affected_asset,
            "action_taken": self.action_taken,
            "status": self.status,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S") if self.created_at else None,
            "read_at": self.read_at.strftime("%Y-%m-%d %H:%M:%S") if self.read_at else None,
            "acknowledged_at": self.acknowledged_at.strftime("%Y-%m-%d %H:%M:%S") if self.acknowledged_at else None,
            "acknowledged_by": self.acknowledged_by,
        }


class NotificationRule(db.Model):
    __tablename__ = "notification_rules"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    severity_threshold = db.Column(db.String(20), default="HIGH", nullable=False)  # ALL, LOW, MEDIUM, HIGH, CRITICAL
    min_risk_score = db.Column(db.Integer, default=70, nullable=False)
    min_event_count = db.Column(db.Integer, default=1, nullable=False)
    time_window_seconds = db.Column(db.Integer, default=60, nullable=False)
    notify_in_app = db.Column(db.Boolean, default=True, nullable=False)
    notify_email = db.Column(db.Boolean, default=False, nullable=False)
    notify_slack = db.Column(db.Boolean, default=False, nullable=False)
    notify_sms = db.Column(db.Boolean, default=False, nullable=False)
    escalate_after_minutes = db.Column(db.Integer, default=5, nullable=False)
    recipient_roles = db.Column(db.String(100), default="SECURITY_ANALYST,ADMIN", nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "severity_threshold": self.severity_threshold,
            "min_risk_score": self.min_risk_score,
            "min_event_count": self.min_event_count,
            "time_window_seconds": self.time_window_seconds,
            "notify_in_app": self.notify_in_app,
            "notify_email": self.notify_email,
            "notify_slack": self.notify_slack,
            "notify_sms": self.notify_sms,
            "escalate_after_minutes": self.escalate_after_minutes,
            "recipient_roles": self.recipient_roles,
            "is_active": self.is_active,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S") if self.created_at else None,
        }


class NotificationDelivery(db.Model):
    __tablename__ = "notification_deliveries"

    id = db.Column(db.Integer, primary_key=True)
    notification_id = db.Column(db.Integer, db.ForeignKey("notifications.id", ondelete="CASCADE"), nullable=True)
    incident_id = db.Column(db.Integer, db.ForeignKey("incidents.id", ondelete="CASCADE"), nullable=True)
    channel = db.Column(db.String(30), nullable=False)  # IN_APP, EMAIL, SLACK, SMS, TEAMS
    recipient = db.Column(db.String(150), nullable=False)
    status = db.Column(db.String(30), default="QUEUED", nullable=False)  # QUEUED, PROCESSING, SENT, DELIVERED, FAILED, ACKNOWLEDGED
    retry_count = db.Column(db.Integer, default=0, nullable=False)
    failure_reason = db.Column(db.Text, nullable=True)
    sent_at = db.Column(db.DateTime, nullable=True)
    delivered_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "notification_id": self.notification_id,
            "incident_id": self.incident_id,
            "channel": self.channel,
            "recipient": self.recipient,
            "status": self.status,
            "retry_count": self.retry_count,
            "failure_reason": self.failure_reason,
            "sent_at": self.sent_at.strftime("%Y-%m-%d %H:%M:%S") if self.sent_at else None,
            "delivered_at": self.delivered_at.strftime("%Y-%m-%d %H:%M:%S") if self.delivered_at else None,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S") if self.created_at else None,
        }


class Asset(db.Model):
    __tablename__ = "assets"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    ip_address = db.Column(db.String(50), unique=True, nullable=False)
    asset_type = db.Column(db.String(50), default="PLC", nullable=False)  # PLC, RTU, HMI, SCADA Server, Industrial Gateway, Sensor, Camera, Edge Device, IT Server
    location = db.Column(db.String(100), default="Assembly Plant Line 1", nullable=False)
    criticality = db.Column(db.String(20), default="HIGH", nullable=False)  # LOW, MEDIUM, HIGH, CRITICAL
    owner_team = db.Column(db.String(100), default="OT Operations & Robotics", nullable=False)
    operational_status = db.Column(db.String(30), default="ONLINE", nullable=False)  # ONLINE, DEGRADED, ISOLATED, OFFLINE
    network_zone = db.Column(db.String(50), default="Zone 2 - SCADA Control", nullable=False)
    threat_count = db.Column(db.Integer, default=0, nullable=False)
    last_seen = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "ip_address": self.ip_address,
            "asset_type": self.asset_type,
            "location": self.location,
            "criticality": self.criticality,
            "owner_team": self.owner_team,
            "operational_status": self.operational_status,
            "network_zone": self.network_zone,
            "threat_count": self.threat_count,
            "last_seen": self.last_seen.strftime("%Y-%m-%d %H:%M:%S") if self.last_seen else None,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S") if self.created_at else None,
        }


class EscalationPolicy(db.Model):
    __tablename__ = "escalation_policies"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    severity = db.Column(db.String(20), default="CRITICAL", nullable=False)
    level_1_role = db.Column(db.String(50), default="SECURITY_ANALYST", nullable=False)
    level_1_wait_minutes = db.Column(db.Integer, default=5, nullable=False)
    level_2_role = db.Column(db.String(50), default="SECURITY_ENGINEER", nullable=False)
    level_2_wait_minutes = db.Column(db.Integer, default=10, nullable=False)
    level_3_role = db.Column(db.String(50), default="ADMIN", nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "severity": self.severity,
            "level_1_role": self.level_1_role,
            "level_1_wait_minutes": self.level_1_wait_minutes,
            "level_2_role": self.level_2_role,
            "level_2_wait_minutes": self.level_2_wait_minutes,
            "level_3_role": self.level_3_role,
            "is_active": self.is_active,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S") if self.created_at else None,
        }


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(30), default="VIEWER", nullable=False)  # ADMIN, SECURITY_ANALYST, SECURITY_ENGINEER, VIEWER
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

