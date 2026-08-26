from datetime import datetime, timedelta
from database.schema import db, Alert


def calculate_threat_score():
    """
    Dynamic real-time threat score calculation engine.
    Calculates an instantaneous, highly responsive threat score between 0 and 100
    using an Exponentially Weighted Moving Average (EWMA) over recent network incursions.

    Dynamic Behavior:
    - Rises rapidly (to 80-98, CRITICAL/HIGH) during high-severity or concentrated attacks.
    - Decays dynamically (to 20-55, LOW/MODERATE/SECURE) during benign/low-risk telemetry periods.
    - Accurately tracks trends and delivers live situational context.
    """
    # 1. Fetch latest 25 alerts ordered by timestamp descending
    recent_alerts = (
        Alert.query.order_by(Alert.id.desc())
        .limit(25)
        .all()
    )

    if not recent_alerts:
        return {
            "score": 15,
            "level": "SECURE",
            "color": "#22C55E",
            "trend": "— Nominal network operations",
            "trend_direction": "stable",
            "trend_pct": 0.0,
            "explanation": "System operating within secure baseline parameters. No critical anomalies detected.",
            "metrics": {
                "critical_count": 0,
                "high_count": 0,
                "avg_risk": 15.0,
                "attack_velocity": 0,
                "active_threat_sources": 0,
                "targeted_hosts": 0,
            }
        }

    # 2. Window segmentation: Current window (latest 10) vs Previous window (next 10)
    current_batch = recent_alerts[:10]
    previous_batch = recent_alerts[10:20] if len(recent_alerts) >= 15 else recent_alerts[5:15]

    # 3. Calculate Exponentially Weighted Risk for Current Batch
    # Decay factor alpha = 0.85 (most recent alerts exert the greatest influence)
    weights = [0.85 ** i for i in range(len(current_batch))]
    total_weight = sum(weights)

    current_weighted_risk = (
        sum(float(a.risk_score or 0) * w for a, w in zip(current_batch, weights)) / total_weight
    )

    # 4. Severity Boost & Decay Modifiers on Top 5 Latest Alerts
    top5 = current_batch[:5]
    crit_count_top = sum(1 for a in top5 if a.severity == "Critical")
    high_count_top = sum(1 for a in top5 if a.severity == "High")
    low_count_top = sum(1 for a in top5 if a.severity in ("Low", "Normal", "Informational"))

    # Dynamic severity pressure
    severity_adjustment = (crit_count_top * 5.0) + (high_count_top * 2.0) - (low_count_top * 6.0)

    # Distinct source/target pressure
    distinct_sources = len(set(a.source_ip for a in current_batch if a.source_ip))
    distinct_targets = len(set(a.destination_ip for a in current_batch if a.destination_ip))
    spread_factor = min(8.0, (distinct_sources * 1.2) + (distinct_targets * 0.8))

    # Time-based Recency Decay: If latest alert is older, decay threat pressure
    now = datetime.utcnow()
    latest_alert_time = recent_alerts[0].timestamp if (recent_alerts and recent_alerts[0].timestamp) else now
    elapsed_seconds = max(0, (now - latest_alert_time).total_seconds())

    # Decay multiplier: 1.0 within 15s, decaying to 0.4 after 60s of calm
    time_decay = max(0.35, 1.0 - (elapsed_seconds / 90.0))

    # 5. Composite Final Score
    raw_score = (current_weighted_risk + severity_adjustment + spread_factor) * time_decay
    score = int(min(98, max(12, round(raw_score))))

    # 6. Map Threat Level Category & SOC Color Token
    if score >= 81:
        level = "CRITICAL"
        color = "#EF4444"
    elif score >= 61:
        level = "HIGH"
        color = "#F97316"
    elif score >= 41:
        level = "MODERATE"
        color = "#FACC15"
    elif score >= 21:
        level = "LOW"
        color = "#38BDF8"
    else:
        level = "SECURE"
        color = "#22C55E"

    # 7. Trend Analysis vs Previous Batch
    if previous_batch:
        prev_weights = [0.85 ** i for i in range(len(previous_batch))]
        prev_weighted_risk = sum(float(a.risk_score or 0) * w for a, w in zip(previous_batch, prev_weights)) / sum(prev_weights)
        diff = score - prev_weighted_risk
        diff_pct = round((diff / max(1.0, prev_weighted_risk)) * 100, 1)
    else:
        diff_pct = 0.0

    if diff_pct >= 2.0:
        trend = f"↑ {abs(int(diff_pct))}% compared with previous window"
        trend_direction = "up"
    elif diff_pct <= -2.0:
        trend = f"↓ {abs(int(diff_pct))}% compared with previous window"
        trend_direction = "down"
    else:
        trend = "— Stable compared with previous window"
        trend_direction = "stable"

    # 8. Situational Explanation
    top_attacks = {}
    for a in current_batch:
        top_attacks[a.attack] = top_attacks.get(a.attack, 0) + 1
    most_common_attack = max(top_attacks.items(), key=lambda x: x[1])[0] if top_attacks else "Telemetry"

    total_crit_window = sum(1 for a in current_batch if a.severity == "Critical")
    total_high_window = sum(1 for a in current_batch if a.severity == "High")

    if score >= 81:
        explanation = f"Critical threat surge: High volume of {most_common_attack} incursions with active payload risk detected across industrial nodes."
    elif score >= 61:
        explanation = f"Elevated incursion risk: Frequent {most_common_attack} activity across {distinct_targets} industrial endpoints under active mitigation."
    elif score >= 41:
        explanation = f"Moderate anomaly rate: Sustained {most_common_attack} flows with {distinct_sources} distinct sources flagged by hybrid ML models."
    elif score >= 21:
        explanation = f"Low threat posture: Normal industrial sensor telemetry with intermittent reconnaissance probing."
    else:
        explanation = "System operating within secure baseline parameters. No critical anomalies detected."

    return {
        "score": score,
        "level": level,
        "color": color,
        "trend": trend,
        "trend_direction": trend_direction,
        "trend_pct": diff_pct,
        "explanation": explanation,
        "metrics": {
            "critical_count": total_crit_window,
            "high_count": total_high_window,
            "avg_risk": round(current_weighted_risk, 1),
            "attack_velocity": len(current_batch),
            "active_threat_sources": distinct_sources,
            "targeted_hosts": distinct_targets,
        }
    }
