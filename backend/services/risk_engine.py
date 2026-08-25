from config import SEVERITY_BASE_MAP


def calculate_risk(attack, confidence):
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

    # Malicious traffic
    base_severity = SEVERITY_BASE_MAP.get(attack, "Medium")
    if base_severity == "Critical":
        risk_score = int(min(100, max(80, round(confidence * 100))))
        severity = "Critical" if confidence >= 0.85 else "High"
    elif base_severity == "High":
        risk_score = int(min(100, max(60, round(confidence * 100))))
        severity = "Critical" if confidence >= 0.92 else "High" if confidence >= 0.70 else "Medium"
    elif base_severity == "Medium":
        risk_score = int(min(85, max(35, round(confidence * 85))))
        severity = "High" if confidence >= 0.90 else "Medium" if confidence >= 0.55 else "Low"
    else:
        risk_score = int(min(60, max(20, round(confidence * 60))))
        severity = "Low"

    return {
        "attack": attack,
        "confidence": round(confidence, 4),
        "risk_score": risk_score,
        "severity": severity
    }
