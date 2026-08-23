from flask import Blueprint, jsonify
from sqlalchemy import func

from database.schema import db, Alert

reports_bp = Blueprint("reports", __name__)


@reports_bp.route("/", methods=["GET"])
def reports_home():
    return {
        "module": "Reports Layer",
        "status": "Running"
    }


# -----------------------------------------
# Dashboard Summary
# -----------------------------------------
@reports_bp.route("/summary", methods=["GET"])
def summary():

    total_alerts = Alert.query.count()

    critical = Alert.query.filter_by(severity="Critical").count()
    high = Alert.query.filter_by(severity="High").count()
    medium = Alert.query.filter_by(severity="Medium").count()
    low = Alert.query.filter_by(severity="Low").count()

    anomalies = Alert.query.filter_by(anomaly=True).count()

    return jsonify({
        "total_alerts": total_alerts,
        "critical": critical,
        "high": high,
        "medium": medium,
        "low": low,
        "anomalies": anomalies
    })


# -----------------------------------------
# Attack Distribution
# -----------------------------------------
@reports_bp.route("/attacks", methods=["GET"])
def attacks():

    data = (
        db.session.query(
            Alert.attack,
            func.count(Alert.id)
        )
        .group_by(Alert.attack)
        .all()
    )

    result = {
        attack: count
        for attack, count in data
    }

    return jsonify(result)


# -----------------------------------------
# Severity Distribution
# -----------------------------------------
@reports_bp.route("/severity", methods=["GET"])
def severity():

    data = (
        db.session.query(
            Alert.severity,
            func.count(Alert.id)
        )
        .group_by(Alert.severity)
        .all()
    )

    result = {
        severity: count
        for severity, count in data
    }

    return jsonify(result)


# -----------------------------------------
# Recent Alerts
# -----------------------------------------
@reports_bp.route("/recent", methods=["GET"])
def recent():

    alerts = (
        Alert.query
        .order_by(Alert.timestamp.desc())
        .limit(10)
        .all()
    )

    return jsonify(
        [alert.to_dict() for alert in alerts]
    )


# -----------------------------------------
# Complete Dashboard Data
# -----------------------------------------
@reports_bp.route("/dashboard", methods=["GET"])
def dashboard():

    total_alerts = Alert.query.count()

    critical = Alert.query.filter_by(severity="Critical").count()
    high = Alert.query.filter_by(severity="High").count()
    medium = Alert.query.filter_by(severity="Medium").count()
    low = Alert.query.filter_by(severity="Low").count()

    attack_distribution = (
        db.session.query(
            Alert.attack,
            func.count(Alert.id)
        )
        .group_by(Alert.attack)
        .all()
    )

    recent_alerts = (
        Alert.query
        .order_by(Alert.timestamp.desc())
        .limit(10)
        .all()
    )

    return jsonify({

        "summary": {

            "total_alerts": total_alerts,
            "critical": critical,
            "high": high,
            "medium": medium,
            "low": low

        },

        "attack_distribution": {

            attack: count
            for attack, count in attack_distribution

        },

        "recent_alerts": [

            alert.to_dict()

            for alert in recent_alerts

        ]

    })
