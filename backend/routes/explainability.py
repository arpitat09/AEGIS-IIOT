from flask import Blueprint, request, jsonify
import os

from config import Config
from ml_pipeline.preprocess import preprocess_uploaded_file
from services.shap_service import explain_prediction

explainability_bp = Blueprint("explainability", __name__)


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