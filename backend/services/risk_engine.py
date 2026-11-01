import numpy as np

SEVERITY_WEIGHT_MAP = {
    "Normal": 10.0,
    "Probe": 55.0,
    "DoS": 75.0,
    "R2L": 80.0,
    "U2R": 95.0,
}


def calculate_risk(attack, confidence, anomaly_score=None, asset_criticality=None, is_modbus=False, is_fdia=False):
    """
    Standard IEEE Methodology Risk Engine:
    Risk Score = (Base Severity Weight * Classification Confidence) + Asset & Cyber-Physical Adjustments
    Mapped to: Low (<45), Medium (45-69), High (70-84), Critical (>=85)
    """
    conf = float(np.clip(confidence, 0.0, 1.0)) if hasattr(confidence, "__float__") else 0.5
    
    if attack == "Normal":
        # Normal traffic: base risk weight is 10, confidence scales inversely with anomaly score
        anom = float(anomaly_score) if anomaly_score is not None else 0.1
        risk_score = int(round(SEVERITY_WEIGHT_MAP["Normal"] * (1.0 - conf * 0.5) + anom * 10))
        risk_score = max(5, min(25, risk_score))
        return {
            "attack": "Normal",
            "confidence": round(conf, 4),
            "risk_score": risk_score,
            "severity": "Low"
        }

    # Malicious traffic: Base Severity Weight * Confidence
    base_weight = SEVERITY_WEIGHT_MAP.get(attack, 60.0)
    base_risk = base_weight * conf

    # Asset Criticality bonus (Purdue Model weight)
    crit_bonus = 0
    if asset_criticality:
        crit_bonus = {"CRITICAL": 15, "HIGH": 10, "MEDIUM": 5, "LOW": 0}.get(str(asset_criticality).upper(), 0)

    # Industrial protocol and cyber-physical bonuses
    modbus_bonus = 10 if is_modbus else 0
    fdia_bonus = 15 if is_fdia else 0

    final_risk = int(min(100, round(base_risk + crit_bonus + modbus_bonus + fdia_bonus)))

    # Consistent severity classification thresholds
    if final_risk >= 85:
        severity = "Critical"
    elif final_risk >= 70:
        severity = "High"
    elif final_risk >= 45:
        severity = "Medium"
    else:
        severity = "Low"

    return {
        "attack": attack,
        "confidence": round(conf, 4),
        "risk_score": final_risk,
        "severity": severity
    }

