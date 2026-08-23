from flask import Blueprint

ingest_bp = Blueprint("ingest", __name__)


@ingest_bp.route("/", methods=["GET"])
def ingest_home():
    return {
        "module": "Data Ingestion Layer",
        "status": "Running"
    }
