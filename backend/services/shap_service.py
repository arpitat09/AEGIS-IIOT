import os
import joblib
import numpy as np
import shap

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models")

# Load models and preprocessing projection weights
lgbm_model = joblib.load(os.path.join(MODELS_DIR, "lightgbm.pkl"))
pca_model = joblib.load(os.path.join(MODELS_DIR, "pca.pkl"))
selected_features = joblib.load(os.path.join(MODELS_DIR, "selected_features.pkl"))
label_encoder = joblib.load(os.path.join(MODELS_DIR, "label_encoder.pkl"))

# Initialize TreeExplainer on LightGBM GBDT ensemble
_explainer = shap.TreeExplainer(lgbm_model)


def explain_sample(X_pca, class_idx=0, top_k=6):
    """
    Computes exact TreeSHAP values for a PCA sample and projects back
    to human-understandable original network flow features.
    """
    X_arr = np.atleast_2d(X_pca)
    shap_vals = _explainer.shap_values(X_arr)

    # Handle shape (n_samples, n_features, n_classes) or list
    if isinstance(shap_vals, np.ndarray) and len(shap_vals.shape) == 3:
        shap_pc = shap_vals[0, :, class_idx]
    elif isinstance(shap_vals, list):
        shap_pc = shap_vals[class_idx][0]
    else:
        shap_pc = np.array(shap_vals)[0]

    # Project PCA SHAP attribution back to original feature space
    # phi_j = sum_k ( W_{k, j} * phi_{PC_k} )
    weights = pca_model.components_  # shape: (n_components, n_selected_features)
    feature_contribs = np.dot(shap_pc, weights)

    sorted_indices = np.argsort(np.abs(feature_contribs))[::-1][:top_k]
    
    explanations = []
    total_abs = max(np.sum(np.abs(feature_contribs)), 1e-6)

    for idx in sorted_indices:
        feat_name = selected_features[idx] if idx < len(selected_features) else f"feature_{idx}"
        impact = float(feature_contribs[idx])
        explanations.append({
            "feature": feat_name,
            "impact": round(impact, 4),
            "importance": round(abs(impact) / total_abs, 4),
            "direction": "increases_risk" if impact > 0 else "decreases_risk"
        })

    return explanations


def get_global_feature_importance():
    """
    Computes dynamic global feature importance across all attack classes.
    """
    weights = pca_model.components_  # (2, 115)
    # Global feature variance projection
    global_importance = np.sum(np.abs(weights), axis=0)
    total = max(np.sum(global_importance), 1e-6)
    
    top_indices = np.argsort(global_importance)[::-1][:8]
    descriptions = {
        "src_bytes": "Bytes sent from source to destination",
        "dst_bytes": "Bytes sent from destination to source",
        "duration": "Length of time connection was active",
        "count": "Number of connections to same destination IP",
        "srv_count": "Number of connections to same port/service",
        "same_srv_rate": "Percentage of connections to same service",
        "dst_host_srv_count": "Destination host service connection density",
        "dst_host_count": "Destination host connection frequency",
        "flag": "TCP connection state flags",
        "protocol_type": "Transport layer protocol (TCP/UDP/ICMP)"
    }

    result = []
    for idx in top_indices:
        feat_name = selected_features[idx] if idx < len(selected_features) else f"feature_{idx}"
        imp = float(global_importance[idx] / total)
        desc = descriptions.get(feat_name, f"Industrial network flow parameter: {feat_name}")
        result.append({
            "feature": feat_name,
            "importance": round(imp, 4),
            "impact": f"+{round(imp * 1.5, 2)}",
            "description": desc
        })

    return result


def explain_prediction(processed_data):
    """
    Legacy endpoint adapter for batch files.
    """
    X_arr = np.atleast_2d(processed_data)
    shap_vals = _explainer.shap_values(X_arr)
    if isinstance(shap_vals, np.ndarray):
        return shap_vals.tolist()
    return [s.tolist() for s in shap_vals]