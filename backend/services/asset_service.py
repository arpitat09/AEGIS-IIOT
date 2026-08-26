from datetime import datetime
from database.schema import db, Asset

DEFAULT_ASSETS = [
    {
        "name": "Industrial PLC-02",
        "ip_address": "192.168.1.2",
        "asset_type": "PLC",
        "location": "Assembly Plant Line 1",
        "criticality": "CRITICAL",
        "owner_team": "OT Operations & Robotics",
        "operational_status": "ONLINE",
        "network_zone": "Zone 2 - SCADA Control",
    },
    {
        "name": "SCADA Master Gateway 01",
        "ip_address": "10.0.0.1",
        "asset_type": "SCADA Server",
        "location": "Central Control Room",
        "criticality": "CRITICAL",
        "owner_team": "Industrial Automation Team",
        "operational_status": "ONLINE",
        "network_zone": "Zone 2 - SCADA Control",
    },
    {
        "name": "Substation RTU-04",
        "ip_address": "192.168.1.1",
        "asset_type": "RTU",
        "location": "Power Distribution Substation",
        "criticality": "HIGH",
        "owner_team": "Smart Energy Team",
        "operational_status": "ONLINE",
        "network_zone": "Zone 1 - Safety / Cell",
    },
    {
        "name": "Robotic Welding Cell Controller",
        "ip_address": "192.168.1.10",
        "asset_type": "Industrial Gateway",
        "location": "Robotics Bay 4",
        "criticality": "HIGH",
        "owner_team": "Manufacturing Engineering",
        "operational_status": "ONLINE",
        "network_zone": "Zone 1 - Safety / Cell",
    },
    {
        "name": "HMI Operator Station 03",
        "ip_address": "192.168.1.20",
        "asset_type": "HMI",
        "location": "Shop Floor Terminal",
        "criticality": "MEDIUM",
        "owner_team": "Floor Operations",
        "operational_status": "ONLINE",
        "network_zone": "Zone 3 - Plant DMZ",
    },
    {
        "name": "Vibration IoT Sensor Array",
        "ip_address": "192.168.1.45",
        "asset_type": "Sensor",
        "location": "Turbine Chamber A",
        "criticality": "MEDIUM",
        "owner_team": "Predictive Maintenance",
        "operational_status": "ONLINE",
        "network_zone": "Zone 1 - Safety / Cell",
    },
    {
        "name": "Telemetry Edge Gateway",
        "ip_address": "192.168.1.101",
        "asset_type": "Edge Device",
        "location": "Edge Server Rack 2",
        "criticality": "HIGH",
        "owner_team": "Infrastructure IT",
        "operational_status": "ONLINE",
        "network_zone": "Zone 3 - Plant DMZ",
    },
]

def init_default_assets():
    """Seed initial industrial assets if not already present."""
    try:
        if Asset.query.count() == 0:
            for item in DEFAULT_ASSETS:
                asset = Asset(
                    name=item["name"],
                    ip_address=item["ip_address"],
                    asset_type=item["asset_type"],
                    location=item["location"],
                    criticality=item["criticality"],
                    owner_team=item["owner_team"],
                    operational_status=item["operational_status"],
                    network_zone=item["network_zone"],
                    threat_count=0,
                    last_seen=datetime.utcnow()
                )
                db.session.add(asset)
            db.session.commit()
            print("[AssetService] Initialized default IIoT asset inventory.")
    except Exception as e:
        db.session.rollback()
        print(f"[AssetService] Initialization warning: {e}")

def get_asset_by_ip(ip_address):
    """Retrieve asset matching destination IP address or return default."""
    if not ip_address:
        return None
    return Asset.query.filter_by(ip_address=ip_address).first()

def calculate_asset_weighted_risk(base_risk_score, asset_criticality):
    """
    Computes asset-aware composite risk score.
    Higher asset criticality amplifies incident priority.
    """
    multipliers = {
        "CRITICAL": 1.25,
        "HIGH": 1.10,
        "MEDIUM": 0.95,
        "LOW": 0.80
    }
    multiplier = multipliers.get(asset_criticality, 1.0)
    adjusted_score = int(min(100, max(5, base_risk_score * multiplier)))
    return adjusted_score
