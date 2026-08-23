import os
import joblib
import numpy as np

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Load trained models
xgb_model = joblib.load(
    os.path.join(BASE_DIR, "models", "xgboost.pkl")
)

lgbm_model = joblib.load(
    os.path.join(BASE_DIR, "models", "lightgbm.pkl")
)

label_encoder = joblib.load(
    os.path.join(BASE_DIR, "models", "label_encoder.pkl")
)


def classify_attack(X):
    """
    Predict attack category using Hybrid XGBoost + LightGBM.
    """

    xgb_prob = xgb_model.predict_proba(X)
    lgbm_prob = lgbm_model.predict_proba(X)

    # Hybrid probability
    probabilities = (xgb_prob + lgbm_prob) / 2

    best_index = np.argmax(probabilities, axis=1)

    labels = label_encoder.inverse_transform(best_index)

    confidence = np.max(probabilities, axis=1)

    return {
        "labels": labels.tolist(),
        "confidence": confidence.tolist()
    }
