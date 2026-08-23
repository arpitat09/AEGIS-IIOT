"""
Data Collection Module
Owner: Anusha N
Implements: System Architecture — Layer 1 (Data Collection)
            Class Diagram — NetworkTrafficRecord.capture()
"""

import pandas as pd

from config import (
    KDD_TRAIN_PATH,
    KDD_TEST_PATH,
    NSL_KDD_COLUMNS,
    ATTACK_CATEGORY_MAP,
)


def load_kdd_dataset(path: str) -> pd.DataFrame:
    """
    Load a raw NSL-KDD dataset file.
    """

    df = pd.read_csv(
        path,
        header=None,
        names=NSL_KDD_COLUMNS
    )

    if df.empty:
        raise ValueError(f"Dataset at {path} is empty.")

    return df


def load_train_test():
    """
    Load both train and test datasets.
    """

    train_df = load_kdd_dataset(KDD_TRAIN_PATH)
    test_df = load_kdd_dataset(KDD_TEST_PATH)

    return train_df, test_df


def map_attack_categories(df):
    """
    Add a 'category' column using ATTACK_CATEGORY_MAP.
    """

    df = df.copy()

    df["label"] = df["label"].astype(str).str.strip()

    unknown = set(df["label"].unique()) - set(ATTACK_CATEGORY_MAP.keys())

    if unknown:
        raise ValueError(
            f"Unknown attack labels found: {sorted(unknown)}"
        )

    df["category"] = df["label"].map(ATTACK_CATEGORY_MAP)

    return df


class NetworkTrafficRecord:

    def __init__(
        self,
        record_id=None,
        timestamp=None,
        source_ip=None,
        dest_ip=None,
        protocol=None,
        raw_features=None,
    ):
        self.record_id = record_id
        self.timestamp = timestamp
        self.source_ip = source_ip
        self.dest_ip = dest_ip
        self.protocol = protocol
        self.raw_features = raw_features

    def to_feature_vector(self):
        return self.raw_features


if __name__ == "__main__":
    train_df, test_df = load_train_test()

    print("Train shape:", train_df.shape)
    print("Test shape:", test_df.shape)

    train_df = map_attack_categories(train_df)

    print(train_df["category"].value_counts())