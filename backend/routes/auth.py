from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify, g
from sqlalchemy import or_

from database.schema import db, User, AuditLog
from services.auth_service import (
    hash_password,
    verify_password,
    validate_password_strength,
    generate_auth_token,
    verify_auth_token,
    generate_reset_token,
    verify_reset_token,
    log_audit_event,
    require_auth,
    require_role,
)

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["POST"])
def login():
    """
    Authenticate user with brute-force protection and audit logging.
    """
    data = request.get_json(force=True, silent=True) or {}
    identifier = data.get("username") or data.get("email")
    password = data.get("password")

    if not identifier or not password:
        return jsonify({"error": "Invalid credentials"}), 400

    identifier = identifier.strip()

    # Find user by username or email
    user = User.query.filter(
        or_(User.username == identifier, User.email == identifier)
    ).first()

    now = datetime.utcnow()

    # Account Lockout Check
    if user and user.locked_until and user.locked_until > now:
        remaining_mins = int((user.locked_until - now).total_seconds() // 60) + 1
        log_audit_event(
            event="LOGIN_LOCKED_ATTEMPT",
            username=user.username,
            user_id=user.id,
            status="BLOCKED",
            details=f"Account temporarily locked for {remaining_mins} more minutes."
        )
        return jsonify({
            "error": f"Account temporarily locked due to repeated failed logins. Try again in {remaining_mins} minutes."
        }), 429

    # Verify Credentials
    if not user or not verify_password(user.password_hash, password):
        if user:
            user.failed_login_attempts += 1
            if user.failed_login_attempts >= 5:
                user.locked_until = now + timedelta(minutes=15)
                log_audit_event(
                    event="ACCOUNT_LOCKED_BRUTE_FORCE",
                    username=user.username,
                    user_id=user.id,
                    status="WARNING",
                    details="Exceeded 5 consecutive failed login attempts. Locked for 15m."
                )
            else:
                log_audit_event(
                    event="LOGIN_FAILED",
                    username=user.username,
                    user_id=user.id,
                    status="FAILED",
                    details=f"Failed attempt {user.failed_login_attempts}/5."
                )
            db.session.commit()
        else:
            log_audit_event(
                event="LOGIN_FAILED_UNKNOWN_USER",
                username=identifier,
                status="FAILED",
                details="Attempted login with non-existent username/email."
            )

        return jsonify({"error": "Invalid credentials"}), 401

    if not user.is_active:
        log_audit_event(
            event="LOGIN_INACTIVE_ACCOUNT",
            username=user.username,
            user_id=user.id,
            status="DENIED",
            details="Disabled account attempted login."
        )
        return jsonify({"error": "Account is inactive. Contact SOC administrator."}), 403

    # Success: Reset failed attempts & update last_login
    user.failed_login_attempts = 0
    user.locked_until = None
    user.last_login = now
    db.session.commit()

    token = generate_auth_token(user)

    log_audit_event(
        event="LOGIN_SUCCESS",
        username=user.username,
        user_id=user.id,
        status="SUCCESS",
        details="Interactive SOC session established."
    )

    return jsonify({
        "status": "ok",
        "token": token,
        "user": user.to_dict(),
        "permissions": {
            "can_manage_users": user.role == "ADMIN",
            "can_execute_prevention": user.role in ["ADMIN", "SECURITY_ANALYST"],
            "can_update_incidents": user.role in ["ADMIN", "SECURITY_ANALYST"],
            "can_view_reports": True,
        }
    }), 200


@auth_bp.route("/logout", methods=["POST"])
def logout():
    """
    Log out active SOC session.
    """
    auth_header = request.headers.get("Authorization", "")
    username = "Anonymous"
    if auth_header.startswith("Bearer "):
        token = auth_header.split(" ", 1)[1]
        payload = verify_auth_token(token)
        if payload:
            username = payload.get("username")

    log_audit_event(
        event="USER_LOGOUT",
        username=username,
        status="SUCCESS",
        details="SOC session closed."
    )
    return jsonify({"status": "ok", "message": "Successfully logged out"}), 200


@auth_bp.route("/me", methods=["GET"])
@require_auth
def get_current_user():
    """
    Get authenticated user profile and permissions.
    """
    user_id = g.current_user.get("user_id")
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "user": user.to_dict(),
        "permissions": {
            "can_manage_users": user.role == "ADMIN",
            "can_execute_prevention": user.role in ["ADMIN", "SECURITY_ANALYST"],
            "can_update_incidents": user.role in ["ADMIN", "SECURITY_ANALYST"],
            "can_view_reports": True,
        }
    })


@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    """
    Generate password reset token without revealing email existence.
    """
    data = request.get_json(force=True, silent=True) or {}
    email = data.get("email", "").strip()

    if email:
        user = User.query.filter(User.email == email).first()
        if user:
            token = generate_reset_token(email)
            log_audit_event(
                event="PASSWORD_RESET_REQUESTED",
                username=user.username,
                user_id=user.id,
                status="SUCCESS",
                details="Password reset token generated."
            )
            # In production, send email; in dev environment return token structure
            return jsonify({
                "status": "ok",
                "message": "If an account exists with this email, password reset instructions have been dispatched.",
                "dev_reset_token": token
            })

    return jsonify({
        "status": "ok",
        "message": "If an account exists with this email, password reset instructions have been dispatched."
    })


@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    """
    Reset password using valid reset token and validate password strength.
    """
    data = request.get_json(force=True, silent=True) or {}
    token = data.get("token")
    new_password = data.get("new_password")

    if not token or not new_password:
        return jsonify({"error": "Token and new password are required."}), 400

    email = verify_reset_token(token)
    if not email:
        return jsonify({"error": "Invalid or expired reset token."}), 400

    user = User.query.filter(User.email == email).first()
    if not user:
        return jsonify({"error": "User not found."}), 404

    is_valid, msg = validate_password_strength(new_password)
    if not is_valid:
        return jsonify({"error": msg}), 400

    user.password_hash = hash_password(new_password)
    user.failed_login_attempts = 0
    user.locked_until = None
    db.session.commit()

    log_audit_event(
        event="PASSWORD_RESET_COMPLETED",
        username=user.username,
        user_id=user.id,
        status="SUCCESS",
        details="Password successfully updated via reset token."
    )

    return jsonify({"status": "ok", "message": "Password successfully updated. Please sign in."})


@auth_bp.route("/change-password", methods=["POST"])
@require_auth
def change_password():
    """
    Change password for authenticated user.
    """
    user_id = g.current_user.get("user_id")
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json(force=True, silent=True) or {}
    old_password = data.get("old_password")
    new_password = data.get("new_password")

    if not verify_password(user.password_hash, old_password):
        return jsonify({"error": "Current password is incorrect."}), 400

    is_valid, msg = validate_password_strength(new_password)
    if not is_valid:
        return jsonify({"error": msg}), 400

    user.password_hash = hash_password(new_password)
    db.session.commit()

    log_audit_event(
        event="PASSWORD_CHANGED",
        username=user.username,
        user_id=user.id,
        status="SUCCESS",
        details="Password changed from user settings."
    )

    return jsonify({"status": "ok", "message": "Password updated successfully."})


@auth_bp.route("/audit-logs", methods=["GET"])
@require_role(["ADMIN"])
def get_audit_logs():
    """
    Retrieve security audit logs (Admin only).
    """
    limit = request.args.get("limit", default=100, type=int)
    offset = request.args.get("offset", default=0, type=int)
    event_filter = request.args.get("event")

    query = AuditLog.query
    if event_filter and event_filter != "All":
        query = query.filter(AuditLog.event == event_filter)

    logs = query.order_by(AuditLog.timestamp.desc()).offset(offset).limit(limit).all()
    total = query.count()

    return jsonify({
        "total": total,
        "logs": [log.to_dict() for log in logs]
    })


@auth_bp.route("/users", methods=["GET"])
@require_role(["ADMIN"])
def list_users():
    """
    List SOC users (Admin only).
    """
    users = User.query.all()
    return jsonify([u.to_dict() for u in users])
