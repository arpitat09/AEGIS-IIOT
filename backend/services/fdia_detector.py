"""
AEGIS-IIOT False Data Injection Attack (FDIA) Detection Engine
-------------------------------------------------------------
Cyber-physical anomaly detector monitoring industrial sensor telemetry
(Temperature, Pressure, Flow Rate, Vibration, Motor Speed, Power)
using physical bounds, slew-rate gradient limits, statistical Z-scores,
and cross-sensor cyber-physical consistency rules.
"""

from datetime import datetime
import numpy as np
import random
import time
from collections import deque

# Sensor baseline specifications and physical tolerances
SENSOR_PROFILES = {
    "temperature": {
        "name": "Cooling Jacket Temperature",
        "sensor_id": "TEMP-PLC-02",
        "asset": "PLC-02 (Siemens S7-1500)",
        "unit": "°C",
        "nominal_mean": 62.5,
        "nominal_std": 2.2,
        "safe_min": 50.0,
        "safe_max": 75.0,
        "max_delta_per_sec": 3.5,  # Max realistic thermal ramp
        "critical_threshold": 85.0
    },
    "pressure": {
        "name": "Boiler Feed Line Pressure",
        "sensor_id": "PRES-SCADA-01",
        "asset": "SCADA Master Server",
        "unit": "bar",
        "nominal_mean": 4.2,
        "nominal_std": 0.25,
        "safe_min": 3.0,
        "safe_max": 5.5,
        "max_delta_per_sec": 0.6,
        "critical_threshold": 6.8
    },
    "flow_rate": {
        "name": "Coolant Flow Rate",
        "sensor_id": "FLOW-VALVE-04",
        "asset": "PLC-02 (Siemens S7-1500)",
        "unit": "L/min",
        "nominal_mean": 120.0,
        "nominal_std": 6.5,
        "safe_min": 90.0,
        "safe_max": 150.0,
        "max_delta_per_sec": 15.0,
        "critical_threshold": 70.0  # Loss of coolant flow is critical
    },
    "vibration": {
        "name": "Turbine Bearing Vibration",
        "sensor_id": "VIB-ROBOT-01",
        "asset": "ABB Robotic Arm Controller",
        "unit": "mm/s",
        "nominal_mean": 0.25,
        "nominal_std": 0.04,
        "safe_min": 0.10,
        "safe_max": 0.60,
        "max_delta_per_sec": 0.18,
        "critical_threshold": 1.20
    },
    "motor_speed": {
        "name": "Main Drive Spindle Speed",
        "sensor_id": "SPD-MOTOR-03",
        "asset": "Schneider Modicon M580",
        "unit": "RPM",
        "nominal_mean": 1500.0,
        "nominal_std": 20.0,
        "safe_min": 1400.0,
        "safe_max": 1600.0,
        "max_delta_per_sec": 80.0,
        "critical_threshold": 1750.0
    },
    "power_consumption": {
        "name": "Substation Feed Power",
        "sensor_id": "PWR-GRID-02",
        "asset": "Moxa Industrial Gateway",
        "unit": "kW",
        "nominal_mean": 18.5,
        "nominal_std": 1.1,
        "safe_min": 14.0,
        "safe_max": 24.0,
        "max_delta_per_sec": 4.0,
        "critical_threshold": 28.0
    }
}

# In-memory historical telemetry buffers for Z-score & gradient tracking
HISTORY_BUFFERS = {
    st: deque(maxlen=40) for st in SENSOR_PROFILES.keys()
}
LAST_READINGS = {}
LAST_TIMESTAMPS = {}


def generate_normal_sensor_reading(sensor_type: str) -> float:
    """Generate realistic noisy telemetry within physical process bounds."""
    profile = SENSOR_PROFILES.get(sensor_type, SENSOR_PROFILES["temperature"])
    val = random.gauss(profile["nominal_mean"], profile["nominal_std"])
    val = max(profile["safe_min"] + 0.5, min(profile["safe_max"] - 0.5, val))
    return round(val, 2)


def evaluate_sensor_reading(sensor_type: str, value: float, timestamp=None) -> dict:
    """
    Evaluate sensor value for False Data Injection Attack anomalies.
    Returns structured analysis with reason, risk score, and confidence.
    """
    if sensor_type not in SENSOR_PROFILES:
        sensor_type = "temperature"

    profile = SENSOR_PROFILES[sensor_type]
    now = timestamp or time.time()
    last_val = LAST_READINGS.get(sensor_type, profile["nominal_mean"])
    last_time = LAST_TIMESTAMPS.get(sensor_type, now - 1.0)
    dt = max(0.1, now - last_time)

    # Store in historical buffer
    buffer = HISTORY_BUFFERS[sensor_type]
    buffer.append(value)
    LAST_READINGS[sensor_type] = value
    LAST_TIMESTAMPS[sensor_type] = now

    # 1. Hard Physical Safety Boundary Check
    is_out_of_bounds = value < profile["safe_min"] or value > profile["safe_max"]
    is_critical_limit = (
        value >= profile["critical_threshold"]
        if profile["nominal_mean"] < profile["critical_threshold"]
        else value <= profile["critical_threshold"]
    )

    # 2. Gradient / Slew Rate (Jump) Check
    delta_rate = abs(value - last_val) / dt
    is_jump_violation = delta_rate > profile["max_delta_per_sec"]

    # 3. Statistical Z-Score Anomaly Check
    z_score = 0.0
    if len(buffer) >= 10:
        mean = float(np.mean(buffer))
        std = float(np.std(buffer)) or 0.001
        z_score = abs(value - mean) / std

    is_statistical_anomaly = z_score > 3.0

    # 4. Multi-Factor FDIA Determination
    reasons = []
    is_fdia = False
    confidence = 0.50
    risk_score = 30
    severity = "Low"

    if is_critical_limit:
        is_fdia = True
        confidence = 0.96
        risk_score = 96
        severity = "Critical"
        reasons.append(
            f"Sensor reading ({value}{profile['unit']}) breached critical physical threshold ({profile['critical_threshold']}{profile['unit']})"
        )

    elif is_jump_violation and is_out_of_bounds:
        is_fdia = True
        confidence = 0.92
        risk_score = 91
        severity = "Critical"
        reasons.append(
            f"Impossible gradient jump: {round(delta_rate, 2)}{profile['unit']}/s exceeds physical thermal/mechanical inertia limit ({profile['max_delta_per_sec']}{profile['unit']}/s)"
        )

    elif is_out_of_bounds:
        is_fdia = True
        confidence = 0.85
        risk_score = 82
        severity = "High"
        reasons.append(
            f"Observed value {value}{profile['unit']} outside expected operating envelope [{profile['safe_min']}–{profile['safe_max']}{profile['unit']}]"
        )

    elif is_jump_violation or is_statistical_anomaly:
        is_fdia = True
        confidence = 0.78
        risk_score = 72
        severity = "Medium"
        reasons.append(
            f"Statistical Z-score deviation (Z={round(z_score, 2)}) indicates stealthy sensor manipulation or data poisoning"
        )

    return {
        "is_fdia": is_fdia,
        "sensor_type": sensor_type,
        "sensor_name": profile["name"],
        "sensor_id": profile["sensor_id"],
        "affected_asset": profile["asset"],
        "unit": profile["unit"],
        "observed_value": value,
        "expected_range": [profile["safe_min"], profile["safe_max"]],
        "nominal_mean": profile["nominal_mean"],
        "confidence": confidence,
        "risk_score": risk_score,
        "severity": severity,
        "z_score": round(z_score, 2),
        "delta_rate": round(delta_rate, 2),
        "reason": " | ".join(reasons) if reasons else "Telemetry within normal operating envelope",
        "attack_type": "False Data Injection Attack (FDIA)" if is_fdia else "Normal Process Telemetry",
        "attack_category": "Cyber-Physical Attack" if is_fdia else "Normal Telemetry",
        "timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    }


def get_live_sensors_overview() -> list:
    """Return live snapshots of all monitored industrial sensors."""
    now = time.time()
    results = []

    for st, profile in SENSOR_PROFILES.items():
        # Retrieve or generate current value
        current_val = LAST_READINGS.get(st)
        if current_val is None:
            current_val = generate_normal_sensor_reading(st)

        eval_result = evaluate_sensor_reading(st, current_val, timestamp=now)
        results.append(eval_result)

    return results


def inject_simulated_fdia_attack(sensor_type: str = "temperature", attack_mode: str = "sudden_spike") -> dict:
    """
    Controlled cyber-physical FDIA simulation (non-destructive).
    Modes:
      - 'sudden_spike': Instantaneous high-magnitude injection
      - 'stealth_bias': Persistent offset causing slow thermal runaway
      - 'impossible_zero': Disconnected / spoofed sensor drop
    """
    if sensor_type not in SENSOR_PROFILES:
        sensor_type = "temperature"

    profile = SENSOR_PROFILES[sensor_type]

    if attack_mode == "sudden_spike":
        if sensor_type == "temperature":
            injected_val = round(random.uniform(92.0, 104.5), 1)
        elif sensor_type == "pressure":
            injected_val = round(random.uniform(7.8, 9.4), 2)
        elif sensor_type == "vibration":
            injected_val = round(random.uniform(1.6, 2.8), 2)
        else:
            injected_val = round(profile["safe_max"] * 1.45, 2)

    elif attack_mode == "stealth_bias":
        injected_val = round(profile["safe_max"] + random.uniform(3.0, 8.0), 2)

    else:  # impossible_zero / drop
        injected_val = round(profile["safe_min"] * 0.25, 2)

    result = evaluate_sensor_reading(sensor_type, injected_val)
    return result
