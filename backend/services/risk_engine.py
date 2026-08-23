from config import SEVERITY_BASE_MAP


def calculate_risk(attack, confidence):

    risk_score = round(confidence * 100)

    if confidence >= 0.95:
        severity = "Critical"

    elif confidence >= 0.85:
        severity = "High"

    elif confidence >= 0.70:
        severity = "Medium"

    else:
        severity = "Low"

    return {
        "attack": attack,
        "confidence": round(confidence, 4),
        "risk_score": risk_score,
        "severity": severity
    }