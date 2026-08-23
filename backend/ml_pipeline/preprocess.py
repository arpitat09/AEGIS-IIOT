"""
Data Preprocessing & Feature Selection Module
"""

import numpy as np
import pandas as pd
import os
import joblib

from sklearn.preprocessing import RobustScaler, OneHotEncoder
from sklearn.decomposition import PCA

from ml_pipeline.config import (
    CATEGORICAL_COLUMNS,
    CORRELATION_THRESHOLD,
    PCA_VARIANCE_RETAINED,
    NSL_KDD_COLUMNS,
)


class DataPreprocessor:

    def __init__(self):

        self.encoder = None
        self.scaler = None
        self.pca = None
        self.selected_features = []

        models_dir = os.path.join(
            os.path.dirname(os.path.dirname(__file__)),
            "models"
        )

        try:
            self.encoder = joblib.load(
                os.path.join(models_dir, "encoder.pkl")
            )

            self.scaler = joblib.load(
                os.path.join(models_dir, "scaler.pkl")
            )

            self.selected_features = joblib.load(
                os.path.join(models_dir, "selected_features.pkl")
            )

            self.pca = joblib.load(
                os.path.join(models_dir, "pca.pkl")
            )

        except Exception:
            # Training mode (artifacts don't exist yet)
            pass

    def clean(self, df: pd.DataFrame) -> pd.DataFrame:

        df = df.copy()

        df.drop_duplicates(inplace=True)
        df.dropna(inplace=True)

        constant_cols = [
            col for col in df.columns
            if df[col].nunique() <= 1
        ]

        if constant_cols:
            df.drop(columns=constant_cols, inplace=True)

        return df

    def encode(self, df: pd.DataFrame, fit=False):

        df = df.copy()

        categorical = [
            c for c in CATEGORICAL_COLUMNS
            if c in df.columns
        ]

        if len(categorical) == 0:
            return df

        numeric = df.drop(columns=categorical)

        if fit:

            self.encoder = OneHotEncoder(
                handle_unknown="ignore",
                sparse_output=False
            )

            encoded = self.encoder.fit_transform(df[categorical])

        else:

            if self.encoder is None:
                raise ValueError("Encoder has not been fitted.")

            encoded = self.encoder.transform(df[categorical])

        encoded_df = pd.DataFrame(
            encoded,
            columns=self.encoder.get_feature_names_out(categorical),
            index=df.index
        )

        return pd.concat(
            [numeric, encoded_df],
            axis=1
        )

    def scale(self, df, fit=False):

        if fit:

            self.scaler = RobustScaler()

            scaled = self.scaler.fit_transform(df)

        else:

            if self.scaler is None:
                raise ValueError("Scaler has not been fitted.")

            scaled = self.scaler.transform(df)

        return pd.DataFrame(
            scaled,
            columns=df.columns,
            index=df.index
        )

    def select_features(self, df, fit=False):

        if fit:

            corr = df.corr().abs()

            upper = corr.where(
                np.triu(np.ones(corr.shape), k=1).astype(bool)
            )

            drop_cols = [
                c for c in upper.columns
                if any(upper[c] > CORRELATION_THRESHOLD)
            ]

            self.selected_features = [
                c for c in df.columns
                if c not in drop_cols
            ]

        return df[self.selected_features]

    def apply_pca(self, df, fit=False):

        if fit:

            self.pca = PCA(
                n_components=PCA_VARIANCE_RETAINED,
                random_state=42
            )

            transformed = self.pca.fit_transform(df)

        else:

            if self.pca is None:
                raise ValueError("PCA has not been fitted.")

            transformed = self.pca.transform(df)

        columns = [
            f"PC{i+1}"
            for i in range(transformed.shape[1])
        ]

        return pd.DataFrame(
            transformed,
            columns=columns,
            index=df.index
        )

    def fit_transform(self, df):

        df = df.copy()

        for col in ["label", "category"]:
            if col in df.columns:
                df.drop(columns=col, inplace=True)

        df = self.clean(df)
        df = self.encode(df, fit=True)
        df = self.scale(df, fit=True)
        df = self.select_features(df, fit=True)
        df = self.apply_pca(df, fit=True)

        os.makedirs("models", exist_ok=True)

        joblib.dump(self.encoder, "models/encoder.pkl")
        joblib.dump(self.scaler, "models/scaler.pkl")
        joblib.dump(self.selected_features, "models/selected_features.pkl")
        joblib.dump(self.pca, "models/pca.pkl")

        return df

    def transform(self, df):

        df = df.copy()

        for col in ["label", "category"]:
            if col in df.columns:
                df.drop(columns=col, inplace=True)

        df = self.clean(df)
        df = self.encode(df, fit=False)
        df = self.scale(df, fit=False)
        df = self.select_features(df, fit=False)
        df = self.apply_pca(df, fit=False)

        return df


def preprocess_uploaded_file(file_path):

    df = pd.read_csv(
        file_path,
        header=None,
        names=NSL_KDD_COLUMNS
    )

    pre = DataPreprocessor()

    return pre.transform(df)


if __name__ == "__main__":

    from ml_pipeline.loader import (
        load_train_test,
        map_attack_categories,
    )

    train_df, test_df = load_train_test()

    train_df = map_attack_categories(train_df)

    pre = DataPreprocessor()

    X_train = pre.fit_transform(train_df)

    X_test = pre.transform(test_df)

    print("Processed train shape:", X_train.shape)
    print("Processed test shape:", X_test.shape)