import os
import joblib
import numpy as np
import shap

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models")

# Load trained XGBoost model
xgboost = joblib.load(
    os.path.join(MODELS_DIR, "xgboost.pkl")
)


def explain_prediction(processed_data):
    """
    Generate SHAP explanations for uploaded samples.
    """

    try:
        # Try TreeExplainer first
        explainer = shap.TreeExplainer(xgboost)
        shap_values = explainer.shap_values(processed_data)

    except Exception:
        # Fallback for older XGBoost models
        background = processed_data[:100]

        explainer = shap.Explainer(
            xgboost.predict_proba,
            background
        )

        explanation = explainer(processed_data)
        shap_values = explanation.values

    if isinstance(shap_values, list):
        shap_values = shap_values[0]

    return np.array(shap_values).tolist()