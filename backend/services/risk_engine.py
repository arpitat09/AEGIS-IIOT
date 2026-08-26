from config import SEVERITY_BASE_MAP


def calculate_risk(attack, confidence, asset_criticality=None, is_modbus=False, is_fdia=False):
    """
    Asset-Weighted Multi-Factor Risk Calculation Engine:
    --------------------------------------------------
    Base Risk is computed from ML confidence and attack baseline severity.
    Then, bonuses are added:
      - Asset Criticality: CRITICAL (+20), HIGH (+15), MEDIUM (+8)
      - Industrial Protocol (Modbus TCP): +10
      - Cyber-Physical Sensor Anomaly (FDIA): +15
    Final Risk is bounded in [5, 100].
    """
    if attack == "Normal":
        # Benign traffic has low risk score
        risk_score = max(5, min(25, round((1.0 - min(confidence, 0.95)) * 100)))
        severity = "Low"
        return {
            "attack": "Normal",
            "confidence": round(confidence, 4),
            "risk_score": risk_score,
            "severity": severity
        }

    # Malicious traffic base computation
    base_severity = SEVERITY_BASE_MAP.get(attack, "Medium")
    if base_severity == "Critical" or is_fdia:
        base_risk = int(min(100, max(80, round(confidence * 100))))
    elif base_severity == "High" or is_modbus:
        base_risk = int(min(100, max(60, round(confidence * 100))))
    elif base_severity == "Medium":
        base_risk = int(min(85, max(35, round(confidence * 85))))
    else:
        base_risk = int(min(60, max(20, round(confidence * 60))))

    # Asset-aware bonus
    crit_bonus = 0
    if asset_criticality:
        crit_bonus = {"CRITICAL": 20, "HIGH": 15, "MEDIUM": 8, "LOW": 0}.get(asset_criticality.upper(), 0)

    modbus_bonus = 10 if is_modbus else 0
    fdia_bonus = 15 if is_fdia else 0

    final_risk = min(100, base_risk + crit_bonus + modbus_bonus + fdia_bonus)

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
        "confidence": round(confidence, 4),
        "risk_score": final_risk,
        "severity": severity
    }
