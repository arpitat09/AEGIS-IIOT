from flask import Blueprint, request, jsonify
import os

from config import Config
from services.predictor import predict

detection_bp = Blueprint("detection", __name__)


@detection_bp.route("/predict", methods=["POST"])
def detect():

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    save_path = os.path.join(
        Config.UPLOAD_FOLDER,
        file.filename
    )

    file.save(save_path)

    result = predict(save_path)

    return jsonify(result)
