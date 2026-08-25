import os
import joblib
import numpy as np
import pandas as pd

from ml_pipeline.preprocess import (
    preprocess_uploaded_file,
    DataPreprocessor
)

from services.risk_engine import calculate_risk
from services.prevention_engine import get_prevention_action

from database.schema import db, Alert


# --------------------------------------------------
# Paths
# --------------------------------------------------

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)


MODELS_DIR = os.path.join(
    BASE_DIR,
    "models"
)


# --------------------------------------------------
# Load ML Models
# --------------------------------------------------

isolation_forest = joblib.load(
    os.path.join(
        MODELS_DIR,
        "isolation_forest.pkl"
    )
)


oneclass_svm = joblib.load(
    os.path.join(
        MODELS_DIR,
        "oneclass_svm.pkl"
    )
)


xgboost = joblib.load(
    os.path.join(
        MODELS_DIR,
        "xgboost.pkl"
    )
)


lightgbm = joblib.load(
    os.path.join(
        MODELS_DIR,
        "lightgbm.pkl"
    )
)


label_encoder = joblib.load(
    os.path.join(
        MODELS_DIR,
        "label_encoder.pkl"
    )
)


# --------------------------------------------------
# Shared Prediction Logic
# --------------------------------------------------

def run_prediction(X, metadata=None):

    # ---------------------------------------
    # Tier 1
    # Anomaly Detection
    # ---------------------------------------

    isolation_prediction = (
        isolation_forest.predict(X)
    )


    svm_prediction = (
        oneclass_svm.predict(X)
    )


    anomalies = np.logical_or(
        isolation_prediction == -1,
        svm_prediction == -1
    )


    # ---------------------------------------
    # Tier 2
    # Attack Classification
    # ---------------------------------------

    xgb_prob = (
        xgboost.predict_proba(X)
    )


    lgb_prob = (
        lightgbm.predict_proba(X)
    )


    probabilities = (
        xgb_prob + lgb_prob
    ) / 2


    predicted_index = np.argmax(
        probabilities,
        axis=1
    )


    predicted_attack = (
        label_encoder.inverse_transform(
            predicted_index
        )
    )


    confidence = np.max(
        probabilities,
        axis=1
    )


    results = []


    # ---------------------------------------
    # Risk + Prevention + Database
    # ---------------------------------------

    for i in range(
        len(predicted_attack)
    ):

        risk = calculate_risk(
            predicted_attack[i],
            float(confidence[i])
        )


        prevention = (
            get_prevention_action(
                risk["severity"]
            )
        )


        result = {

            "anomaly":
                bool(anomalies[i]),

            "attack":
                risk["attack"],

            "confidence":
                risk["confidence"],

            "risk_score":
                risk["risk_score"],

            "severity":
                risk["severity"],

            "action":
                prevention["action"]
        }


        # ---------------------------------------
        # Real-Time Metadata
        # ---------------------------------------

        flow_metadata = {}

        if metadata is not None:

            if isinstance(
                metadata,
                list
            ):

                if i < len(metadata):

                    flow_metadata = (
                        metadata[i]
                    )

            elif isinstance(
                metadata,
                dict
            ):

                flow_metadata = metadata


        # ---------------------------------------
        # Save Alert
        # ---------------------------------------

        alert = Alert(

            attack=result["attack"],

            confidence=result[
                "confidence"
            ],

            risk_score=result[
                "risk_score"
            ],

            severity=result[
                "severity"
            ],

            action=result[
                "action"
            ],

            anomaly=result[
                "anomaly"
            ],

            source_ip=flow_metadata.get(
                "source_ip"
            ),

            destination_ip=flow_metadata.get(
                "destination_ip"
            ),

            source_port=flow_metadata.get(
                "source_port"
            ),

            destination_port=flow_metadata.get(
                "destination_port"
            ),

            protocol=flow_metadata.get(
                "protocol"
            ),

            service=flow_metadata.get(
                "service"
            ),

            packet_count=flow_metadata.get(
                "packet_count"
            ),

            total_bytes=flow_metadata.get(
                "total_bytes"
            ),

            duration=flow_metadata.get(
                "duration"
            ),

            detection_source=flow_metadata.get(
                "detection_source",
                "uploaded"
            )
        )


        db.session.add(
            alert
        )


        # ---------------------------------------
        # Complete Result
        # ---------------------------------------

        result.update(
            flow_metadata
        )


        results.append(
            result
        )


    # ---------------------------------------
    # Commit Alerts
    # ---------------------------------------

    db.session.commit()

    try:
        from routes.events import broadcast_event
        for r in results:
            broadcast_event("new_alert", r)
    except Exception:
        pass

    return results


# --------------------------------------------------
# CSV Upload Prediction
# --------------------------------------------------

def predict(file_path):

    X = preprocess_uploaded_file(
        file_path
    )


    return run_prediction(
        X,
        metadata={
            "detection_source":
                "uploaded"
        }
    )


# --------------------------------------------------
# Real-Time Feature Prediction
# --------------------------------------------------

def predict_features(
    df,
    metadata=None
):

    if not isinstance(
        df,
        pd.DataFrame
    ):

        df = pd.DataFrame(
            df
        )


    preprocessor = (
        DataPreprocessor()
    )


    X = preprocessor.transform(
        df
    )


    return run_prediction(
        X,
        metadata=metadata
    )