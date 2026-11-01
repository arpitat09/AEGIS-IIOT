import os
import joblib
import numpy as np

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Load trained models
isolation_forest = joblib.load(
    os.path.join(BASE_DIR, "models", "isolation_forest.pkl")
)

oneclass_svm = joblib.load(
    os.path.join(BASE_DIR, "models", "oneclass_svm.pkl")
)


def calibrated_anomaly_score(decision_scores):
    """
    Calibrate raw decision_function scores into [0, 1] anomaly probabilities.
    decision_function is positive for normal inliers, negative for outliers.
    P(anomaly) = 1 / (1 + exp(3.0 * decision_scores)).
    Works consistently for single real-time samples (N=1) and batches (N>1).
    """
    scores = np.asarray(decision_scores, dtype=np.float64)
    scores_clipped = np.clip(scores, -10.0, 10.0)
    return 1.0 / (1.0 + np.exp(3.0 * scores_clipped))


def detect_anomalies(X, threshold=0.50):
    """
    Detect anomalies using Hybrid Tier-1 ensemble (Isolation Forest + One-Class SVM).
    Returns calibrated anomaly scores and binary anomaly flags.
    """
    iso_df = isolation_forest.decision_function(X)
    svm_df = oneclass_svm.decision_function(X)

    iso_scores = calibrated_anomaly_score(iso_df)
    svm_scores = calibrated_anomaly_score(svm_df)

    # Hybrid consensus score
    final_scores = (iso_scores + svm_scores) / 2.0

    # Binary flags: outlier if calibrated score > threshold or either model marks outlier (-1)
    iso_pred = isolation_forest.predict(X) == -1
    svm_pred = oneclass_svm.predict(X) == -1
    predictions = (final_scores > threshold) | iso_pred | svm_pred

    return {
        "scores": np.atleast_1d(final_scores).tolist(),
        "predictions": np.atleast_1d(predictions).tolist(),
        "iso_scores": np.atleast_1d(iso_scores).tolist(),
        "svm_scores": np.atleast_1d(svm_scores).tolist(),
    }
