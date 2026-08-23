"""
Central configuration for the IDPS project.
Keep all paths, thresholds, and hyperparameters here — never hardcode them
inside the pipeline modules. This makes the whole system tunable from one
place, which you will want when you're doing hyperparameter experiments
for Phase-2/3 evaluation.
"""

import os

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATA_RAW_DIR = os.path.join(BASE_DIR, "data", "raw")
DATA_PROCESSED_DIR = os.path.join(BASE_DIR, "data", "processed")
MODELS_DIR = os.path.join(BASE_DIR, "models")
REPORTS_DIR = os.path.join(BASE_DIR, "reports")

KDD_TRAIN_PATH = os.path.join(DATA_RAW_DIR, "KDDTrain+.txt")
KDD_TEST_PATH = os.path.join(DATA_RAW_DIR, "KDDTest+.txt")

# SQLite for local dev — swap for a MySQL URI later if you implement that
# part of the Database Design slide, e.g.:
# "mysql+pymysql://user:password@localhost/idps_iiot"
DATABASE_URI = "sqlite:///" + os.path.join(BASE_DIR, "idps.db")

# ---------------------------------------------------------------------------
# NSL-KDD column schema (standard 41 features + label + difficulty)
# ---------------------------------------------------------------------------
NSL_KDD_COLUMNS = [
    "duration", "protocol_type", "service", "flag", "src_bytes", "dst_bytes",
    "land", "wrong_fragment", "urgent", "hot", "num_failed_logins", "logged_in",
    "num_compromised", "root_shell", "su_attempted", "num_root",
    "num_file_creations", "num_shells", "num_access_files", "num_outbound_cmds",
    "is_host_login", "is_guest_login", "count", "srv_count", "serror_rate",
    "srv_serror_rate", "rerror_rate", "srv_rerror_rate", "same_srv_rate",
    "diff_srv_rate", "srv_diff_host_rate", "dst_host_count", "dst_host_srv_count",
    "dst_host_same_srv_rate", "dst_host_diff_srv_rate",
    "dst_host_same_src_port_rate", "dst_host_srv_diff_host_rate",
    "dst_host_serror_rate", "dst_host_srv_serror_rate", "dst_host_rerror_rate",
    "dst_host_srv_rerror_rate", "label", "difficulty",
]

CATEGORICAL_COLUMNS = ["protocol_type", "service", "flag"]

# Maps raw NSL-KDD attack labels to the 4 broad categories used throughout
# your report (DoS, Probe, R2L, U2R) + normal. Fill this in / extend it as
# you discover which labels actually appear in your copy of the dataset —
# print(df['label'].unique()) after loading to check.
ATTACK_CATEGORY_MAP = {
    "normal": "Normal",
    # DoS
    "neptune": "DoS", "smurf": "DoS", "back": "DoS", "teardrop": "DoS",
    "pod": "DoS", "land": "DoS", "apache2": "DoS", "udpstorm": "DoS",
    "processtable": "DoS", "mailbomb": "DoS",
    # Probe
    "satan": "Probe", "ipsweep": "Probe", "nmap": "Probe", "portsweep": "Probe",
    "mscan": "Probe", "saint": "Probe",
    # R2L
    "guess_passwd": "R2L", "ftp_write": "R2L", "imap": "R2L", "phf": "R2L",
    "multihop": "R2L", "warezmaster": "R2L", "warezclient": "R2L",
    "spy": "R2L", "xlock": "R2L", "xsnoop": "R2L", "snmpguess": "R2L",
    "snmpgetattack": "R2L", "httptunnel": "R2L", "sendmail": "R2L",
    "named": "R2L", "worm": "R2L",
    # U2R
    "buffer_overflow": "U2R", "loadmodule": "U2R", "rootkit": "U2R",
    "perl": "U2R", "sqlattack": "U2R", "xterm": "U2R", "ps": "U2R",
    # TODO: check your actual dataset for any labels not listed here and add them.
}

# ---------------------------------------------------------------------------
# Preprocessing
# ---------------------------------------------------------------------------
PCA_VARIANCE_RETAINED = 0.95        # Layer 2 — retain 95% variance (slide: "41→18 features")
CORRELATION_THRESHOLD = 0.95        # drop features correlated above this

# ---------------------------------------------------------------------------
# Tier-1 — Anomaly Detection
# ---------------------------------------------------------------------------
ISOLATION_FOREST_PARAMS = {
    "n_estimators": 100,
    "max_samples": 256,
    "contamination": 0.05,
    "random_state": 42,
}
ONE_CLASS_SVM_PARAMS = {
    "kernel": "rbf",
    "gamma": 0.1,
    "nu": 0.05,
}
ANOMALY_SCORE_THRESHOLD = 0.60      # matches the activity diagram decision node

# ---------------------------------------------------------------------------
# Tier-2 — Attack Classification
# ---------------------------------------------------------------------------
XGBOOST_PARAMS = {
    "max_depth": 8,
    "learning_rate": 0.1,
    "n_estimators": 500,
    "objective": "multi:softprob",
    "reg_lambda": 1.0,
    "reg_alpha": 0.1,
    "random_state": 42,
}
LIGHTGBM_PARAMS = {
    "num_leaves": 63,
    "learning_rate": 0.05,
    "random_state": 42,
}
SMOTE_ENN_PARAMS = {
    # For multi-class targets SMOTE-ENN expects a dict or "auto".
    # Using "auto" ensures minority classes are resampled appropriately.
    "sampling_strategy": "auto",
}

# ---------------------------------------------------------------------------
# Tier-3 — Severity & Prevention
# ---------------------------------------------------------------------------
SEVERITY_LEVELS = ["Low", "Medium", "High", "Critical"]

# Base severity per attack category before confidence adjustment.
# TODO (Deeksha): tune this against your project report's justification.
SEVERITY_BASE_MAP = {
    "DoS": "High",
    "Probe": "Medium",
    "R2L": "High",
    "U2R": "Critical",
}

ACTION_MAP = {
    "Low": "alert",
    "Medium": "rate_limit",
    "High": "terminate_session",
    "Critical": "block_ip",
}