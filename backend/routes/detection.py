from flask import Blueprint, request, jsonify
import os

from config import Config
from services.predictor import predict

detection_bp = Blueprint("detection", __name__)


@detection_bp.route("/predict", methods=["POST"])
def detect():

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    save_path = os.path.join(
        Config.UPLOAD_FOLDER,
        file.filename
    )

    file.save(save_path)

    result = predict(save_path)

    return jsonify(result)


# ==================================================
# SENSOR CYBER-PHYSICAL TELEMETRY & FDIA
# ==================================================

@detection_bp.route("/sensors", methods=["GET"])
def get_sensor_telemetry():
    """Returns live telemetry and safety status of all monitored industrial sensors."""
    from services.fdia_detector import get_live_sensors_overview
    sensors = get_live_sensors_overview()
    return jsonify({
        "sensors": sensors,
        "total_monitored": len(sensors),
        "fdia_active": any(s.get("is_fdia") for s in sensors),
        "safety_envelope_status": "COMPROMISED" if any(s.get("is_fdia") for s in sensors) else "SECURE"
    })


@detection_bp.route("/simulate-fdia", methods=["POST"])
def trigger_simulate_fdia():
    """
    Trigger an on-demand False Data Injection Attack (FDIA) simulation.
    Safe and non-destructive.
    """
    from services.fdia_detector import inject_simulated_fdia_attack
    from services.industrial_correlation_engine import correlate_industrial_cyber_physical_event

    data = request.get_json(force=True, silent=True) or {}
    sensor_type = data.get("sensor_type", "temperature")
    attack_mode = data.get("attack_mode", "sudden_spike")

    eval_result = inject_simulated_fdia_attack(sensor_type=sensor_type, attack_mode=attack_mode)

    incident = None
    if eval_result.get("is_fdia"):
        incident = correlate_industrial_cyber_physical_event(
            fdia_event=eval_result,
            modbus_metadata={
                "source_ip": "198.51.100.23",
                "destination_ip": "192.168.1.10",
                "attack": f"FDIA ({sensor_type.capitalize()}) Injection"
            }
        )

    return jsonify({
        "status": "success",
        "fdia_evaluation": eval_result,
        "incident_created": incident.to_dict() if incident else None
    })


@detection_bp.route("/simulate-modbus", methods=["POST"])
def trigger_simulate_modbus():
    """
    Trigger an on-demand simulated Modbus TCP protocol incursion.
    Safe and non-destructive.
    """
    from services.industrial_correlation_engine import correlate_industrial_cyber_physical_event
    from database.schema import db, Alert

    data = request.get_json(force=True, silent=True) or {}
    attack_scenario = data.get("scenario", "Unauthorized Modbus Function Request")
    src_ip = data.get("source_ip", "198.51.100.23")
    dst_ip = data.get("destination_ip", "192.168.1.10")

    alert = Alert(
        attack=attack_scenario,
        confidence=0.93,
        risk_score=88,
        severity="High",
        action="Block IP",
        anomaly=True,
        source_ip=src_ip,
        destination_ip=dst_ip,
        source_port=54321,
        destination_port=502,
        protocol="TCP",
        service="Modbus TCP",
        packet_count=12,
        total_bytes=1420,
        duration=0.45,
        detection_source="industrial_simulation",
        status="Investigating"
    )
    db.session.add(alert)
    db.session.commit()

    incident = correlate_industrial_cyber_physical_event(
        network_alert=alert,
        modbus_metadata={
            "source_ip": src_ip,
            "destination_ip": dst_ip,
            "attack": attack_scenario
        }
    )

    return jsonify({
        "status": "success",
        "alert": alert.to_dict(),
        "incident": incident.to_dict() if incident else None
    })

