import re
import os
from datetime import datetime, timedelta
from functools import wraps

from flask import request, jsonify, g
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadTimeSignature, BadSignature

from database.schema import db, User, AuditLog

SECRET_KEY = os.environ.get("AEGIS_SECRET_KEY", "aegis-iiot-enterprise-soc-secure-secret-2026")
AUTH_SERIALIZER = URLSafeTimedSerializer(SECRET_KEY, salt="aegis-auth-token")
RESET_SERIALIZER = URLSafeTimedSerializer(SECRET_KEY, salt="aegis-reset-token")


def hash_password(password: str) -> str:
    """Hash password using PBKDF2-SHA256."""
    return generate_password_hash(password, method="pbkdf2:sha256:600000")


def verify_password(password_hash: str, password: str) -> bool:
    """Verify password against hashed hash."""
    if not password_hash or not password:
        return False
    return check_password_hash(password_hash, password)


def validate_password_strength(password: str) -> tuple[bool, str]:
    """
    Validates enterprise password policy:
    - Minimum 12 characters
    - At least 1 uppercase letter
    - At least 1 lowercase letter
    - At least 1 digit
    - At least 1 special character
    """
    if len(password) < 12:
        return False, "Password must be at least 12 characters long."
    if not re.search(r"[A-Z]", password):
        return False, "Password must contain at least one uppercase letter."
    if not re.search(r"[a-z]", password):
        return False, "Password must contain at least one lowercase letter."
    if not re.search(r"\d", password):
        return False, "Password must contain at least one numerical digit."
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>_\-+=\[\]]", password):
        return False, "Password must contain at least one special character."
    return True, ""


def generate_auth_token(user: User, expires_in_seconds: int = 86400) -> str:
    """Generate a tamper-proof timestamped auth token."""
    payload = {
        "user_id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role,
    }
    return AUTH_SERIALIZER.dumps(payload)


def verify_auth_token(token: str, max_age: int = 86400) -> dict | None:
    """Verify auth token and check expiration."""
    try:
        data = AUTH_SERIALIZER.loads(token, max_age=max_age)
        return data
    except (SignatureExpired, BadTimeSignature, BadSignature):
        return None


def generate_reset_token(email: str) -> str:
    """Generate a 30-minute password reset token."""
    return RESET_SERIALIZER.dumps({"email": email})


def verify_reset_token(token: str, max_age: int = 1800) -> str | None:
    """Verify password reset token."""
    try:
        data = RESET_SERIALIZER.loads(token, max_age=max_age)
        return data.get("email")
    except Exception:
        return None


def log_audit_event(
    event: str,
    username: str = None,
    user_id: int = None,
    ip_address: str = None,
    status: str = "SUCCESS",
    details: str = None
):
    """Record an audit log entry for security traceability."""
    try:
        ip = ip_address or request.remote_addr or "127.0.0.1"
        audit = AuditLog(
            user_id=user_id,
            username=username or "System",
            event=event,
            ip_address=ip,
            status=status,
            details=details,
            timestamp=datetime.utcnow()
        )
        db.session.add(audit)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"[AuditLog] Failed to record event: {e}")


def seed_default_users():
    """Auto-seed default SOC users on startup if not already existing."""
    default_users = [
        {
            "username": "admin",
            "email": "admin@aegis-iiot.sec",
            "password": "Admin@Aegis2026!SOC",
            "role": "ADMIN",
        },
        {
            "username": "analyst",
            "email": "analyst@aegis-iiot.sec",
            "password": "Analyst@Aegis2026!SOC",
            "role": "SECURITY_ANALYST",
        },
        {
            "username": "viewer",
            "email": "viewer@aegis-iiot.sec",
            "password": "Viewer@Aegis2026!SOC",
            "role": "VIEWER",
        },
    ]

    for u in default_users:
        existing = User.query.filter((User.username == u["username"]) | (User.email == u["email"])).first()
        if not existing:
            new_user = User(
                username=u["username"],
                email=u["email"],
                password_hash=hash_password(u["password"]),
                role=u["role"],
                is_active=True,
                created_at=datetime.utcnow()
            )
            db.session.add(new_user)
    try:
        db.session.commit()
        print("[AuthService] Default SOC users initialized.")
    except Exception as e:
        db.session.rollback()
        print(f"[AuthService] Seed notice: {e}")


def require_auth(f):
    """Middleware decorator ensuring a valid Bearer token is present."""
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Unauthorized: Missing authentication token"}), 401
        
        token = auth_header.split(" ", 1)[1]
        payload = verify_auth_token(token)
        if not payload:
            return jsonify({"error": "Unauthorized: Invalid or expired token"}), 401

        g.current_user = payload
        return f(*args, **kwargs)
    return decorated


def require_role(allowed_roles: list[str]):
    """Middleware decorator ensuring authenticated user possesses one of the allowed roles."""
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            auth_header = request.headers.get("Authorization", "")
            if not auth_header.startswith("Bearer "):
                return jsonify({"error": "Unauthorized: Authentication required"}), 401
            
            token = auth_header.split(" ", 1)[1]
            payload = verify_auth_token(token)
            if not payload:
                return jsonify({"error": "Unauthorized: Invalid or expired session"}), 401

            user_role = payload.get("role", "VIEWER")
            if user_role not in allowed_roles:
                return jsonify({
                    "error": f"Forbidden: Insufficient privileges. Required: {', '.join(allowed_roles)}"
                }), 403

            g.current_user = payload
            return f(*args, **kwargs)
        return decorated
    return decorator
