from flask import Blueprint, jsonify, request
from sqlalchemy import func

from database.schema import db, Alert


prevention_bp = Blueprint(
    "prevention",
    __name__
)


@prevention_bp.route(
    "/",
    methods=["GET"]
)
def get_prevention_data():

    # =====================================
    # Total Threats Blocked
    # =====================================

    threats_blocked = (
        db.session.query(
            func.count(Alert.id)
        )
        .filter(
            Alert.action == "Block IP"
        )
        .scalar()
        or 0
    )


    # =====================================
    # Rate Limited Threats
    # =====================================

    rate_limited = (
        db.session.query(
            func.count(Alert.id)
        )
        .filter(
            Alert.action == "Rate Limit"
        )
        .scalar()
        or 0
    )


    # =====================================
    # Terminated Sessions
    # =====================================

    sessions_terminated = (
        db.session.query(
            func.count(Alert.id)
        )
        .filter(
            Alert.action == "Terminate Session"
        )
        .scalar()
        or 0
    )


    # =====================================
    # Active Firewall Rules
    # =====================================

    active_firewall_rules = (
        db.session.query(
            func.count(Alert.id)
        )
        .filter(
            Alert.action == "Block IP"
        )
        .scalar()
        or 0
    )


    # =====================================
    # Recent Prevention Actions
    # =====================================

    recent_alerts = (
        Alert.query
        .filter(
            Alert.action != "Alert"
        )
        .order_by(
            Alert.timestamp.desc()
        )
        .limit(10)
        .all()
    )


    recent_actions = []


    for alert in recent_alerts:

        recent_actions.append({

            "id":
                alert.id,

            "timestamp":
                (
                    alert.timestamp.strftime(
                        "%Y-%m-%d %H:%M:%S"
                    )
                    if alert.timestamp
                    else None
                ),

            "action":
                alert.action,

            "attack":
                alert.attack,

            "severity":
                alert.severity,

            "risk_score":
                alert.risk_score,

            "source_ip":
                alert.source_ip,

            "destination_ip":
                alert.destination_ip,

            "confidence":
                alert.confidence,
        })


    # =====================================
    # Firewall Rules
    # =====================================

    blocked_alerts = (
        Alert.query
        .filter(
            Alert.action == "Block IP"
        )
        .order_by(
            Alert.timestamp.desc()
        )
        .limit(10)
        .all()
    )


    firewall_rules = []


    for alert in blocked_alerts:

        firewall_rules.append({

            "id":
                alert.id,

            "source_ip":
                alert.source_ip,

            "destination_ip":
                alert.destination_ip,

            "attack":
                alert.attack,

            "severity":
                alert.severity,

            "status":
                "Active",

            "action":
                "Block IP",
        })


    # =====================================
    # Final API Response
    # =====================================

    return jsonify({

        "summary": {

            "threats_blocked":
                threats_blocked,

            "active_firewall_rules":
                active_firewall_rules,

            "rate_limited":
                rate_limited,

            "sessions_terminated":
                sessions_terminated,
        },


        "recent_actions":
            recent_actions,


        "firewall_rules":
            firewall_rules,


        "status":
            "Running"
    })


@prevention_bp.route("/rules/block", methods=["POST"])
def manual_block_ip():
    """
    Manually add an IP block rule.
    """
    data = request.get_json(force=True, silent=True) or {}
    ip = data.get("ip")
    reason = data.get("reason", "Manual Block")

    if not ip:
        return jsonify({"error": "IP address required"}), 400

    alert = Alert(
        attack="Manual Policy Enforcement",
        confidence=1.0,
        risk_score=100,
        severity="Critical",
        action="Block IP",
        anomaly=True,
        source_ip=ip,
        status="Blocked",
        detection_source="manual_policy"
    )
    db.session.add(alert)
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": f"IP {ip} blocked successfully",
        "rule": alert.to_dict()
    })


@prevention_bp.route("/rules/unblock/<int:rule_id>", methods=["DELETE", "POST"])
def unblock_rule(rule_id):
    """
    Unblock an existing firewall rule.
    """
    alert = Alert.query.get(rule_id)
    if not alert:
        return jsonify({"error": "Rule not found"}), 404

    alert.action = "Alert"
    alert.status = "Resolved"
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": f"Rule {rule_id} for IP {alert.source_ip} unblocked",
        "rule": alert.to_dict()
    })