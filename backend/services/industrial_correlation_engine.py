"""
AEGIS-IIOT Industrial Cyber-Physical Threat Correlation Engine
--------------------------------------------------------------
Correlates:
  1. Network Flow Events (ML predictions)
  2. Industrial Protocol Events (Modbus TCP port 502 anomalies)
  3. Cyber-Physical Sensor Telemetry (FDIA detections)
  4. Asset Criticality Topology
into unified, deduplicated enterprise incidents.
"""

from datetime import datetime, timedelta
import json
from database.schema import db, Incident, Alert, Asset, AuditLog
from services.ai_incident_service import generate_ai_incident_summary, generate_ai_recommended_response
from services.notification_rule_engine import evaluate_and_dispatch_incident_notifications


def calculate_asset_weighted_risk(
    base_ml_risk: int,
    asset_criticality: str = "HIGH",
    is_modbus: bool = False,
    is_fdia: bool = False,
    event_count: int = 1
) -> int:
    """
    Asset-Weighted Multi-Factor Industrial Risk Formula:
    ---------------------------------------------------
    Final Risk = Base ML Risk (0-100)
               + Asset Criticality Bonus (CRITICAL: +20, HIGH: +15, MEDIUM: +8, LOW: +0)
               + Industrial Protocol (Modbus TCP) Bonus (+10)
               + Cyber-Physical Sensor Anomaly (FDIA) Bonus (+15)
               + Event Recurrence Bonus (+min(10, event_count * 2))
    Capped at 100 max.
    """
    crit_bonus = {
        "CRITICAL": 20,
        "HIGH": 15,
        "MEDIUM": 8,
        "LOW": 0
    }.get(asset_criticality.upper(), 10)

    modbus_bonus = 10 if is_modbus else 0
    fdia_bonus = 15 if is_fdia else 0
    frequency_bonus = min(10, (event_count - 1) * 2) if event_count > 1 else 0

    composite = base_ml_risk + crit_bonus + modbus_bonus + fdia_bonus + frequency_bonus
    return min(100, max(10, int(composite)))


def correlate_industrial_cyber_physical_event(
    network_alert=None,
    fdia_event=None,
    modbus_metadata=None
) -> Incident:
    """
    Correlate multi-source industrial telemetry into a unified incident.
    """
    now = datetime.utcnow()
    sliding_window = now - timedelta(seconds=120)

    # Determine Target Asset & IPs
    source_ip = "198.51.100.23"
    destination_ip = "192.168.1.10"
    asset_name = "PLC-02 (Siemens S7-1500)"
    asset_criticality = "CRITICAL"
    attack_type = "Industrial Cyber-Physical Threat"
    base_risk = 70
    is_modbus = False
    is_fdia = False

    if network_alert:
        source_ip = network_alert.source_ip or source_ip
        destination_ip = network_alert.destination_ip or destination_ip
        attack_type = network_alert.attack or attack_type
        base_risk = network_alert.risk_score or base_risk
        if network_alert.service == "modbus" or network_alert.destination_port == 502 or network_alert.source_port == 502:
            is_modbus = True

    if modbus_metadata:
        is_modbus = True
        source_ip = modbus_metadata.get("source_ip", source_ip)
        destination_ip = modbus_metadata.get("destination_ip", destination_ip)
        if "attack" in modbus_metadata:
            attack_type = modbus_metadata["attack"]

    if fdia_event:
        is_fdia = True
        asset_name = fdia_event.get("affected_asset", asset_name)
        attack_type = f"FDIA + {attack_type}" if network_alert else "False Data Injection Attack (FDIA)"
        base_risk = max(base_risk, fdia_event.get("risk_score", 85))

    # Match registered asset for criticality
    matched_asset = Asset.query.filter(
        (Asset.ip_address == destination_ip) | (Asset.name == asset_name)
    ).first()
    if matched_asset:
        asset_name = matched_asset.name
        asset_criticality = matched_asset.criticality

    # 1. Search for Active Sliding Window Incident to Correlate / Deduplicate
    existing_incident = (
        Incident.query.filter(
            Incident.status.in_(["NEW", "ACKNOWLEDGED", "INVESTIGATING"]),
            Incident.destination_ip == destination_ip,
            Incident.last_seen >= sliding_window
        )
        .order_by(Incident.last_seen.desc())
        .first()
    )

    if existing_incident:
        # Deduplicate & Elevate Existing Incident
        existing_incident.event_count += 1
        existing_incident.last_seen = now
        existing_incident.duration_seconds = int((now - existing_incident.first_seen).total_seconds())

        # Update composite risk
        composite_risk = calculate_asset_weighted_risk(
            base_ml_risk=base_risk,
            asset_criticality=asset_criticality,
            is_modbus=is_modbus,
            is_fdia=is_fdia,
            event_count=existing_incident.event_count
        )
        existing_incident.risk_score = composite_risk

        if composite_risk >= 85:
            existing_incident.severity = "Critical"
            existing_incident.priority = "P1-Critical"

        # Append timeline entry
        try:
            timeline = json.loads(existing_incident.timeline_json or "[]")
            timeline.append({
                "timestamp": now.strftime("%H:%M:%S"),
                "event": f"Correlated event: {attack_type} (FDIA: {is_fdia}, Modbus: {is_modbus})",
                "risk": composite_risk
            })
            existing_incident.timeline_json = json.dumps(timeline[-20:])
        except Exception:
            pass

        if network_alert and not network_alert.incident_id:
            network_alert.incident_id = existing_incident.id

        db.session.commit()
        return existing_incident

    # 2. Provision New Correlated Industrial Incident
    composite_risk = calculate_asset_weighted_risk(
        base_ml_risk=base_risk,
        asset_criticality=asset_criticality,
        is_modbus=is_modbus,
        is_fdia=is_fdia,
        event_count=1
    )

    severity = "Critical" if composite_risk >= 85 else "High" if composite_risk >= 70 else "Medium"
    priority = "P1-Critical" if severity == "Critical" else "P2-High" if severity == "High" else "P3-Medium"

    # Generate incident code
    inc_count = Incident.query.count() + 1
    incident_code = f"AEGIS-IIOT-{now.strftime('%Y%m')}-{inc_count:04d}"

    if is_fdia and is_modbus:
        title = f"Critical Cyber-Physical Incursion: Modbus Exploit & Sensor Tampering on {asset_name}"
    elif is_fdia:
        title = f"Cyber-Physical Anomaly: False Data Injection Attack against {asset_name}"
    elif is_modbus:
        title = f"Industrial Protocol Incursion: {attack_type} on {asset_name} (Port 502)"
    else:
        title = f"Industrial Security Incident: {attack_type} targeting {asset_name}"

    ai_summary = generate_ai_incident_summary(
        attack_type=attack_type,
        severity=severity,
        risk_score=composite_risk,
        source_ip=source_ip,
        destination_ip=destination_ip,
        affected_asset=asset_name,
        event_count=1,
        duration_seconds=0,
        action="Block IP & Isolate Gateway" if severity == "Critical" else "Rate Limit"
    )

    ai_playbook = generate_ai_recommended_response(attack_type, severity, asset_name, source_ip=source_ip)

    initial_timeline = [
        {
            "timestamp": now.strftime("%H:%M:%S"),
            "event": f"Initial incursion detected: {attack_type} against {asset_name} (Source: {source_ip})",
            "action": "CORRELATION_INITIATED"
        }
    ]

    new_incident = Incident(
        incident_code=incident_code,
        title=title,
        description=f"Correlated industrial cyber-physical incident involving {asset_name} ({destination_ip}).",
        severity=severity,
        priority=priority,
        risk_score=composite_risk,
        attack_type=attack_type,
        source_ip=source_ip,
        destination_ip=destination_ip,
        affected_asset=asset_name,
        event_count=1,
        first_seen=now,
        last_seen=now,
        duration_seconds=0,
        status="NEW",
        assigned_analyst="Unassigned",
        recommended_action="Isolate industrial gateway and verify PLC sensor data.",
        automatic_action_taken="Block IP & Isolate Gateway" if severity == "Critical" else "Rate Limit",
        notification_status="Dispatched",
        escalation_level=1,
        ai_summary=ai_summary,
        ai_recommended_response=ai_playbook,
        timeline_json=json.dumps(initial_timeline),
        created_at=now,
        updated_at=now
    )

    db.session.add(new_incident)
    db.session.flush()

    if network_alert:
        network_alert.incident_id = new_incident.id

    # Update Asset Threat Count
    if matched_asset:
        matched_asset.threat_count = (matched_asset.threat_count or 0) + 1
        matched_asset.last_seen = now

    audit = AuditLog(
        event="INDUSTRIAL_INCIDENT_CORRELATED",
        username="CorrelationEngine",
        status="SUCCESS",
        details=f"Correlated {incident_code} ({severity}) on {asset_name}"
    )
    db.session.add(audit)
    db.session.commit()

    # Trigger Multi-Channel Notifications via Rule Engine
    try:
        evaluate_and_dispatch_incident_notifications(new_incident)
    except Exception as e:
        print(f"[Notification Rule Engine Warning]: {e}")

    # Real-Time SSE Push
    try:
        from routes.events import broadcast_event
        broadcast_event("new_incident", new_incident.to_dict())
    except Exception:
        pass

    return new_incident
