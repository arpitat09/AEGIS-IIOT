from flask import Blueprint, jsonify

from database.schema import Alert

monitoring_bp = Blueprint("monitoring", __name__)


@monitoring_bp.route("/", methods=["GET"])
def monitoring_home():
    return {
        "module": "Monitoring Layer",
        "status": "Running"
    }


@monitoring_bp.route("/alerts", methods=["GET"])
def get_alerts():

    alerts = Alert.query.order_by(
        Alert.timestamp.desc()
    ).all()

    return jsonify(
        [alert.to_dict() for alert in alerts]
    )