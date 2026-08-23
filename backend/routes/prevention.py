from flask import Blueprint

prevention_bp = Blueprint("prevention", __name__)


@prevention_bp.route("/", methods=["GET"])
def prevention_home():
    return {
        "module": "Prevention Layer",
        "status": "Running"
    }
