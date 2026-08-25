from flask import Blueprint
from sqlalchemy import func

from database.schema import db, Alert


analytics_bp = Blueprint(
    "analytics",
    __name__
)


# --------------------------------------------------
# Analytics Home
# --------------------------------------------------

@analytics_bp.route("/", methods=["GET"])
def analytics_home():

    return {
        "module": "Analytics",
        "status": "Running"
    }


# --------------------------------------------------
# Analytics Summary
# --------------------------------------------------

@analytics_bp.route("/summary", methods=["GET"])
def analytics_summary():

    # ----------------------------------------------
    # Total Alerts
    # ----------------------------------------------

    total_alerts = Alert.query.count()


    # ----------------------------------------------
    # Severity Distribution
    # ----------------------------------------------

    severity_rows = (
        db.session.query(
            Alert.severity,
            func.count(Alert.id)
        )
        .group_by(Alert.severity)
        .all()
    )


    severity_distribution = {
        severity: count
        for severity, count in severity_rows
    }


    # ----------------------------------------------
    # Attack Distribution
    # ----------------------------------------------

    attack_rows = (
        db.session.query(
            Alert.attack,
            func.count(Alert.id)
        )
        .group_by(Alert.attack)
        .order_by(
            func.count(Alert.id).desc()
        )
        .all()
    )


    attack_distribution = {
        attack: count
        for attack, count in attack_rows
    }


    # ----------------------------------------------
    # Action Distribution
    # ----------------------------------------------

    action_rows = (
        db.session.query(
            Alert.action,
            func.count(Alert.id)
        )
        .group_by(Alert.action)
        .all()
    )


    action_distribution = {
        action: count
        for action, count in action_rows
    }


    # ----------------------------------------------
    # Average Risk Score
    # ----------------------------------------------

    average_risk_score = (
        db.session.query(
            func.avg(Alert.risk_score)
        )
        .scalar()
    )


    if average_risk_score is None:
        average_risk_score = 0


    # ----------------------------------------------
    # Critical Alerts
    # ----------------------------------------------

    critical_alerts = (
        Alert.query
        .filter(
            Alert.severity == "Critical"
        )
        .count()
    )


    # ----------------------------------------------
    # High Severity Alerts
    # ----------------------------------------------

    high_alerts = (
        Alert.query
        .filter(
            Alert.severity == "High"
        )
        .count()
    )


    # ----------------------------------------------
    # Recent Alerts
    # ----------------------------------------------

    recent_alerts = (
        Alert.query
        .order_by(
            Alert.timestamp.desc()
        )
        .limit(10)
        .all()
    )


    recent_data = []


    for alert in recent_alerts:

        recent_data.append({

            "id":
                alert.id,

            "timestamp":
                alert.timestamp.strftime(
                    "%Y-%m-%d %H:%M:%S"
                )
                if alert.timestamp
                else None,

            "attack":
                alert.attack,

            "severity":
                alert.severity,

            "risk_score":
                alert.risk_score,

            "confidence":
                alert.confidence,

            "action":
                alert.action,

            "source_ip":
                alert.source_ip,

            "destination_ip":
                alert.destination_ip,

            "protocol":
                alert.protocol,

            "detection_source":
                alert.detection_source
        })


    # ----------------------------------------------
    # Return Analytics Data
    # ----------------------------------------------

    return {

        "total_alerts":
            total_alerts,

        "critical_alerts":
            critical_alerts,

        "high_alerts":
            high_alerts,

        "average_risk_score":
            round(
                float(average_risk_score),
                2
            ),

        "severity_distribution":
            severity_distribution,

        "attack_distribution":
            attack_distribution,

        "action_distribution":
            action_distribution,

        "recent_alerts":
            recent_data
    }


# --------------------------------------------------
# Severity Analytics
# --------------------------------------------------

@analytics_bp.route(
    "/severity",
    methods=["GET"]
)
def severity_analytics():

    rows = (
        db.session.query(
            Alert.severity,
            func.count(Alert.id)
        )
        .group_by(Alert.severity)
        .all()
    )


    data = []


    for severity, count in rows:

        data.append({

            "severity":
                severity,

            "count":
                count
        })


    return data


# --------------------------------------------------
# Attack Analytics
# --------------------------------------------------

@analytics_bp.route(
    "/attacks",
    methods=["GET"]
)
def attack_analytics():

    rows = (
        db.session.query(
            Alert.attack,
            func.count(Alert.id)
        )
        .group_by(Alert.attack)
        .order_by(
            func.count(Alert.id).desc()
        )
        .all()
    )


    data = []


    for attack, count in rows:

        data.append({

            "attack":
                attack,

            "count":
                count
        })


    return data


# --------------------------------------------------
# Risk Analytics
# --------------------------------------------------

@analytics_bp.route(
    "/risk",
    methods=["GET"]
)
def risk_analytics():

    alerts = (
        Alert.query
        .order_by(
            Alert.timestamp.desc()
        )
        .limit(50)
        .all()
    )


    data = []


    for alert in alerts:

        data.append({

            "id":
                alert.id,

            "timestamp":
                alert.timestamp.strftime(
                    "%Y-%m-%d %H:%M:%S"
                )
                if alert.timestamp
                else None,

            "attack":
                alert.attack,

            "risk_score":
                alert.risk_score,

            "severity":
                alert.severity
        })


    return data