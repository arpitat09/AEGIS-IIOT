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


def normalize(scores):
    """
    Normalize anomaly scores between 0 and 1.
    """
    scores = np.asarray(scores)

    minimum = scores.min()
    maximum = scores.max()

    if maximum - minimum == 0:
        return np.zeros_like(scores)

    return (scores - minimum) / (maximum - minimum)


def detect_anomalies(X):
    """
    Detect anomalies using both Isolation Forest and One-Class SVM.
    """

    iso_scores = -isolation_forest.decision_function(X)
    svm_scores = -oneclass_svm.decision_function(X)

    iso_scores = normalize(iso_scores)
    svm_scores = normalize(svm_scores)

    final_scores = (iso_scores + svm_scores) / 2

    predictions = final_scores > 0.5

    return {
        "scores": final_scores.tolist(),
        "predictions": predictions.tolist()
    }
