from datetime import datetime
from flask import Blueprint, jsonify, request
from database.schema import db, Asset, AuditLog

assets_bp = Blueprint("assets", __name__)

@assets_bp.route("", methods=["GET"])
@assets_bp.route("/", methods=["GET"])
def get_assets():
    """List all registered industrial assets and operational status."""
    assets = Asset.query.order_by(Asset.criticality.desc(), Asset.name.asc()).all()
    return jsonify([a.to_dict() for a in assets])

@assets_bp.route("", methods=["POST"])
@assets_bp.route("/", methods=["POST"])
def create_asset():
    """Register a new industrial IoT asset."""
    data = request.get_json(force=True, silent=True) or {}
    
    asset = Asset(
        name=data.get("name"),
        ip_address=data.get("ip_address"),
        asset_type=data.get("asset_type", "PLC"),
        location=data.get("location", "Plant Floor"),
        criticality=data.get("criticality", "HIGH"),
        owner_team=data.get("owner_team", "OT Operations"),
        operational_status=data.get("operational_status", "ONLINE"),
        network_zone=data.get("network_zone", "Zone 2 - SCADA Control"),
        threat_count=0,
        last_seen=datetime.utcnow(),
        created_at=datetime.utcnow()
    )
    db.session.add(asset)
    db.session.commit()

    return jsonify(asset.to_dict()), 201

@assets_bp.route("/<int:asset_id>", methods=["PUT", "PATCH"])
def update_asset(asset_id):
    """Update industrial asset status, location, or criticality."""
    asset = Asset.query.get(asset_id)
    if not asset:
        return jsonify({"error": "Asset not found"}), 404

    data = request.get_json(force=True, silent=True) or {}
    if "operational_status" in data:
        asset.operational_status = data["operational_status"]
    if "criticality" in data:
        asset.criticality = data["criticality"]
    if "location" in data:
        asset.location = data["location"]
    if "owner_team" in data:
        asset.owner_team = data["owner_team"]

    db.session.commit()
    return jsonify(asset.to_dict())
