"""
AEGIS-IIOT: Rigorous Benchmark Evaluation & Ablation Study Script
Evaluates real experimental metrics on NSL-KDD KDDTest+.txt (22,544 samples).
No fabricated values: computes exact mathematical metrics using scikit-learn.
"""
import os
import sys
import time
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)

from ml_pipeline.config import NSL_KDD_COLUMNS, ATTACK_CATEGORY_MAP
from ml_pipeline.preprocess import preprocess_uploaded_file


def measure_latency_percentiles(predict_fn, X, num_repeats=500):
    """
    Measures per-sample inference latency: mean, median, 95th, 99th percentile in milliseconds.
    """
    latencies = []
    # Warm-up
    for _ in range(10):
        _ = predict_fn(X[:1])

    sample_pool = X[:min(len(X), num_repeats)]
    for i in range(len(sample_pool)):
        sample = sample_pool[i:i+1]
        t0 = time.perf_counter()
        _ = predict_fn(sample)
        t1 = time.perf_counter()
        latencies.append((t1 - t0) * 1000.0)  # ms

    return {
        "mean_latency_ms": round(float(np.mean(latencies)), 3),
        "median_latency_ms": round(float(np.median(latencies)), 3),
        "p95_latency_ms": round(float(np.percentile(latencies, 95)), 3),
        "p99_latency_ms": round(float(np.percentile(latencies, 99)), 3),
        "samples_tested": len(latencies)
    }


def run_benchmark():
    test_path = os.path.join(BASE_DIR, "uploads", "KDDTest+.txt")
    if not os.path.exists(test_path):
        print(f"Error: {test_path} not found.")
        return

    print("================================================================")
    print("AEGIS-IIOT: BENCHMARK EVALUATION & ABLATION STUDY")
    print("Dataset: NSL-KDD KDDTest+.txt")
    print("================================================================")

    # 1. Preprocess features
    print("Preprocessing test data via RobustScaler + PCA...")
    t0_prep = time.time()
    X_test = preprocess_uploaded_file(test_path)
    prep_time = round(time.time() - t0_prep, 3)
    print(f"Preprocessed shape: {X_test.shape} in {prep_time}s")
    print("----------------------------------------------------------------")

    # 2. Align ground truth using preprocessed row index
    df_raw = pd.read_csv(test_path, header=None, names=NSL_KDD_COLUMNS)
    df_raw["category"] = df_raw["label"].map(ATTACK_CATEGORY_MAP).fillna("Other")
    df_clean = df_raw.loc[X_test.index].copy()

    # Binary ground truth: 0 = Normal, 1 = Attack
    y_binary_true = (df_clean["category"] != "Normal").astype(int).values
    y_multi_true = df_clean["category"].values

    total_samples = len(df_clean)
    normal_count = int(np.sum(y_binary_true == 0))
    attack_count = int(np.sum(y_binary_true == 1))

    print(f"Total Test Samples: {total_samples}")
    print(f"Normal Flows:       {normal_count} ({normal_count/total_samples*100:.1f}%)")
    print(f"Attack Flows:       {attack_count} ({attack_count/total_samples*100:.1f}%)")
    print("Category breakdown:\n", df_clean["category"].value_counts().to_dict())
    print("----------------------------------------------------------------")

    # 3. Load trained model artifacts
    models_dir = os.path.join(BASE_DIR, "models")
    if_model = joblib.load(os.path.join(models_dir, "isolation_forest.pkl"))
    svm_model = joblib.load(os.path.join(models_dir, "oneclass_svm.pkl"))
    xgb_model = joblib.load(os.path.join(models_dir, "xgboost.pkl"))
    lgb_model = joblib.load(os.path.join(models_dir, "lightgbm.pkl"))
    label_encoder = joblib.load(os.path.join(models_dir, "label_encoder.pkl"))

    results = {}

    # ------------------------------------------------------------------
    # ABLATION 1: Isolation Forest alone (Binary Anomaly Detection)
    # ------------------------------------------------------------------
    print("\n[1/6] Evaluating Isolation Forest alone...")
    if_pred = (if_model.predict(X_test) == -1).astype(int)  # 1 = Anomaly/Attack
    cm_if = confusion_matrix(y_binary_true, if_pred)
    tn, fp, fn, tp = cm_if.ravel()
    fpr_if = fp / (fp + tn) if (fp + tn) > 0 else 0.0
    fnr_if = fn / (fn + tp) if (fn + tp) > 0 else 0.0
    lat_if = measure_latency_percentiles(lambda x: if_model.predict(x), X_test)

    results["isolation_forest_alone"] = {
        "accuracy": round(float(accuracy_score(y_binary_true, if_pred)), 4),
        "precision": round(float(precision_score(y_binary_true, if_pred, zero_division=0)), 4),
        "recall": round(float(recall_score(y_binary_true, if_pred, zero_division=0)), 4),
        "f1_score": round(float(f1_score(y_binary_true, if_pred, zero_division=0)), 4),
        "fpr": round(float(fpr_if), 4),
        "fnr": round(float(fnr_if), 4),
        "confusion_matrix": {"TN": int(tn), "FP": int(fp), "FN": int(fn), "TP": int(tp)},
        "latency": lat_if
    }
    print(f"   Accuracy: {results['isolation_forest_alone']['accuracy']*100:.2f}% | Precision: {results['isolation_forest_alone']['precision']*100:.2f}% | Recall: {results['isolation_forest_alone']['recall']*100:.2f}% | F1: {results['isolation_forest_alone']['f1_score']*100:.2f}%")
    print(f"   Mean Latency: {lat_if['mean_latency_ms']} ms | Median: {lat_if['median_latency_ms']} ms")

    # ------------------------------------------------------------------
    # ABLATION 2: One-Class SVM alone (Binary Anomaly Detection)
    # ------------------------------------------------------------------
    print("\n[2/6] Evaluating One-Class SVM alone...")
    svm_pred = (svm_model.predict(X_test) == -1).astype(int)
    cm_svm = confusion_matrix(y_binary_true, svm_pred)
    tn, fp, fn, tp = cm_svm.ravel()
    fpr_svm = fp / (fp + tn) if (fp + tn) > 0 else 0.0
    fnr_svm = fn / (fn + tp) if (fn + tp) > 0 else 0.0
    lat_svm = measure_latency_percentiles(lambda x: svm_model.predict(x), X_test)

    results["oneclass_svm_alone"] = {
        "accuracy": round(float(accuracy_score(y_binary_true, svm_pred)), 4),
        "precision": round(float(precision_score(y_binary_true, svm_pred, zero_division=0)), 4),
        "recall": round(float(recall_score(y_binary_true, svm_pred, zero_division=0)), 4),
        "f1_score": round(float(f1_score(y_binary_true, svm_pred, zero_division=0)), 4),
        "fpr": round(float(fpr_svm), 4),
        "fnr": round(float(fnr_svm), 4),
        "confusion_matrix": {"TN": int(tn), "FP": int(fp), "FN": int(fn), "TP": int(tp)},
        "latency": lat_svm
    }
    print(f"   Accuracy: {results['oneclass_svm_alone']['accuracy']*100:.2f}% | Precision: {results['oneclass_svm_alone']['precision']*100:.2f}% | Recall: {results['oneclass_svm_alone']['recall']*100:.2f}% | F1: {results['oneclass_svm_alone']['f1_score']*100:.2f}%")
    print(f"   Mean Latency: {lat_svm['mean_latency_ms']} ms | Median: {lat_svm['median_latency_ms']} ms")

    # ------------------------------------------------------------------
    # ABLATION 3: XGBoost alone on Known Attack Subset
    # ------------------------------------------------------------------
    print("\n[3/6] Evaluating XGBoost alone on attack samples...")
    attack_mask = (y_binary_true == 1)
    X_attacks = X_test[attack_mask]
    y_attacks = y_multi_true[attack_mask]
    
    # Filter only labels present in label_encoder
    valid_mask = np.isin(y_attacks, label_encoder.classes_)
    X_attacks_valid = X_attacks[valid_mask]
    y_attacks_valid = y_attacks[valid_mask]

    xgb_pred_idx = np.argmax(xgb_model.predict_proba(X_attacks_valid), axis=1)
    xgb_pred_labels = label_encoder.inverse_transform(xgb_pred_idx)
    lat_xgb = measure_latency_percentiles(lambda x: xgb_model.predict_proba(x), X_attacks_valid)

    results["xgboost_alone"] = {
        "accuracy": round(float(accuracy_score(y_attacks_valid, xgb_pred_labels)), 4),
        "macro_f1": round(float(f1_score(y_attacks_valid, xgb_pred_labels, average="macro", zero_division=0)), 4),
        "weighted_f1": round(float(f1_score(y_attacks_valid, xgb_pred_labels, average="weighted", zero_division=0)), 4),
        "latency": lat_xgb
    }
    print(f"   Attack Classification Accuracy: {results['xgboost_alone']['accuracy']*100:.2f}% | Weighted F1: {results['xgboost_alone']['weighted_f1']*100:.2f}%")
    print(f"   Mean Latency: {lat_xgb['mean_latency_ms']} ms | Median: {lat_xgb['median_latency_ms']} ms")

    # ------------------------------------------------------------------
    # ABLATION 4: LightGBM alone on Known Attack Subset
    # ------------------------------------------------------------------
    print("\n[4/6] Evaluating LightGBM alone on attack samples...")
    lgb_pred_idx = np.argmax(lgb_model.predict_proba(X_attacks_valid), axis=1)
    lgb_pred_labels = label_encoder.inverse_transform(lgb_pred_idx)
    lat_lgb = measure_latency_percentiles(lambda x: lgb_model.predict_proba(x), X_attacks_valid)

    results["lightgbm_alone"] = {
        "accuracy": round(float(accuracy_score(y_attacks_valid, lgb_pred_labels)), 4),
        "macro_f1": round(float(f1_score(y_attacks_valid, lgb_pred_labels, average="macro", zero_division=0)), 4),
        "weighted_f1": round(float(f1_score(y_attacks_valid, lgb_pred_labels, average="weighted", zero_division=0)), 4),
        "latency": lat_lgb
    }
    print(f"   Attack Classification Accuracy: {results['lightgbm_alone']['accuracy']*100:.2f}% | Weighted F1: {results['lightgbm_alone']['weighted_f1']*100:.2f}%")
    print(f"   Mean Latency: {lat_lgb['mean_latency_ms']} ms | Median: {lat_lgb['median_latency_ms']} ms")

    # ------------------------------------------------------------------
    # ABLATION 5: XGBoost + LightGBM Ensemble on Attack Subset
    # ------------------------------------------------------------------
    print("\n[5/6] Evaluating XGBoost + LightGBM Ensemble...")
    p_xgb = xgb_model.predict_proba(X_attacks_valid)
    p_lgb = lgb_model.predict_proba(X_attacks_valid)
    ens_prob = (p_xgb + p_lgb) / 2.0
    ens_pred_idx = np.argmax(ens_prob, axis=1)
    ens_pred_labels = label_encoder.inverse_transform(ens_pred_idx)
    
    lat_ens = measure_latency_percentiles(
        lambda x: (xgb_model.predict_proba(x) + lgb_model.predict_proba(x)) / 2.0,
        X_attacks_valid
    )

    results["gbdt_ensemble"] = {
        "accuracy": round(float(accuracy_score(y_attacks_valid, ens_pred_labels)), 4),
        "macro_f1": round(float(f1_score(y_attacks_valid, ens_pred_labels, average="macro", zero_division=0)), 4),
        "weighted_f1": round(float(f1_score(y_attacks_valid, ens_pred_labels, average="weighted", zero_division=0)), 4),
        "latency": lat_ens
    }
    print(f"   Ensemble Accuracy: {results['gbdt_ensemble']['accuracy']*100:.2f}% | Weighted F1: {results['gbdt_ensemble']['weighted_f1']*100:.2f}%")
    print(f"   Mean Latency: {lat_ens['mean_latency_ms']} ms | Median: {lat_ens['median_latency_ms']} ms")

    # ------------------------------------------------------------------
    # ABLATION 6: Complete End-to-End Cascaded Hybrid Pipeline
    # ------------------------------------------------------------------
    print("\n[6/6] Evaluating Complete Hybrid Cascaded Pipeline (Tier 1 Gating -> Tier 2 Classification)...")
    from services.anomaly_detector import detect_anomalies
    
    t0_hybrid = time.perf_counter()
    anom_res = detect_anomalies(X_test)
    anom_flags = np.array(anom_res["predictions"], dtype=bool)

    # Classify confirmed anomalies
    p_xgb_all = xgb_model.predict_proba(X_test)
    p_lgb_all = lgb_model.predict_proba(X_test)
    p_hybrid_all = (p_xgb_all + p_lgb_all) / 2.0
    all_attack_preds = label_encoder.inverse_transform(np.argmax(p_hybrid_all, axis=1))

    # Gated final predictions: Normal if not anomalous, else classified attack
    final_hybrid_preds = np.where(anom_flags, all_attack_preds, "Normal")
    t1_hybrid = time.perf_counter()

    lat_hybrid = measure_latency_percentiles(
        lambda x: np.where(
            np.array(detect_anomalies(x)["predictions"]),
            label_encoder.inverse_transform(np.argmax((xgb_model.predict_proba(x) + lgb_model.predict_proba(x))/2.0, axis=1)),
            "Normal"
        ),
        X_test
    )

    # Multiclass evaluation across all 5 classes (Normal, DoS, Probe, R2L, U2R)
    classes_5 = ["Normal", "DoS", "Probe", "R2L", "U2R"]
    # Filter to only the 5 standard categories
    mask_5 = np.isin(y_multi_true, classes_5)
    y_true_5 = y_multi_true[mask_5]
    y_pred_5 = final_hybrid_preds[mask_5]

    acc_hybrid = float(accuracy_score(y_true_5, y_pred_5))
    macro_f1_hybrid = float(f1_score(y_true_5, y_pred_5, average="macro", zero_division=0))
    weighted_f1_hybrid = float(f1_score(y_true_5, y_pred_5, average="weighted", zero_division=0))
    report_hybrid = classification_report(y_true_5, y_pred_5, output_dict=True, zero_division=0)
    cm_hybrid = confusion_matrix(y_true_5, y_pred_5, labels=classes_5).tolist()

    results["complete_hybrid_pipeline"] = {
        "accuracy": round(acc_hybrid, 4),
        "macro_f1": round(macro_f1_hybrid, 4),
        "weighted_f1": round(weighted_f1_hybrid, 4),
        "confusion_matrix_classes": classes_5,
        "confusion_matrix": cm_hybrid,
        "per_class": {
            cls: {
                "precision": round(float(report_hybrid[cls]["precision"]), 4),
                "recall": round(float(report_hybrid[cls]["recall"]), 4),
                "f1_score": round(float(report_hybrid[cls]["f1-score"]), 4),
                "support": int(report_hybrid[cls]["support"])
            }
            for cls in classes_5 if cls in report_hybrid
        },
        "latency": lat_hybrid
    }

    print(f"   Complete Hybrid Accuracy: {acc_hybrid*100:.2f}% | Macro F1: {macro_f1_hybrid*100:.2f}% | Weighted F1: {weighted_f1_hybrid*100:.2f}%")
    print(f"   Mean Latency: {lat_hybrid['mean_latency_ms']} ms | Median: {lat_hybrid['median_latency_ms']} ms")
    print("\n   Per-Class Performance:")
    for cls in classes_5:
        if cls in report_hybrid:
            r = report_hybrid[cls]
            print(f"     {cls:8s} | Prec: {r['precision']*100:5.1f}% | Rec: {r['recall']*100:5.1f}% | F1: {r['f1-score']*100:5.1f}% | Support: {r['support']}")

    # Save output report
    report_path = os.path.join(BASE_DIR, "evaluation_report.json")
    with open(report_path, "w") as fp:
        json.dump(results, fp, indent=2)
    print(f"\n================================================================")
    print(f"Full benchmark and ablation results saved to: {report_path}")
    print(f"================================================================")


if __name__ == "__main__":
    run_benchmark()
