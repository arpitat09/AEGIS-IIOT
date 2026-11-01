from flask import Blueprint, request, jsonify
import os

from config import Config
from ml_pipeline.preprocess import preprocess_uploaded_file
from services.shap_service import explain_prediction

explainability_bp = Blueprint("explainability", __name__)


@explainability_bp.route("/", methods=["GET"])
def explainability_home():
    return jsonify({
        "module": "Explainability & SHAP Layer",
        "status": "Running"
    })


from services.shap_service import explain_prediction, get_global_feature_importance, explain_sample


@explainability_bp.route("/summary", methods=["GET"])
def explainability_summary():
    """
    Returns dynamically computed global feature importance and key SHAP summary insights.
    """
    feature_importance = get_global_feature_importance()
    return jsonify({
        "status": "success",
        "model": "XGBoost + LightGBM Hybrid Classifier",
        "explainer": "SHAP TreeExplainer (Projected Linear Weights)",
        "features": feature_importance
    })


@explainability_bp.route("/explain", methods=["POST"])
def explain():

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    path = os.path.join(
        Config.UPLOAD_FOLDER,
        file.filename
    )

    file.save(path)

    processed = preprocess_uploaded_file(path)

    shap_values = explain_prediction(processed)

    return jsonify({
        "shap_values": shap_values
    })