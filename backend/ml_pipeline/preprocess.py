"""
Data Preprocessing & Feature Selection Module
"""

import os
import joblib
import numpy as np
import pandas as pd

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

        BASE_DIR = os.path.dirname(
            os.path.dirname(os.path.abspath(__file__))
        )

        MODELS_DIR = os.path.join(
            BASE_DIR,
            "models"
        )

        try:

            self.encoder = joblib.load(
                os.path.join(MODELS_DIR, "encoder.pkl")
            )

            self.scaler = joblib.load(
                os.path.join(MODELS_DIR, "scaler.pkl")
            )

            self.selected_features = joblib.load(
                os.path.join(
                    MODELS_DIR,
                    "selected_features.pkl"
                )
            )

            self.pca = joblib.load(
                os.path.join(MODELS_DIR, "pca.pkl")
            )

        except Exception as e:

            print(
                "Warning: Preprocessing artifacts could not be loaded:",
                e
            )

    # --------------------------------------------------
    # CLEAN DATA
    # --------------------------------------------------

    def clean(self, df):

        df = df.copy()

        df.drop_duplicates(inplace=True)
        df.dropna(inplace=True)

        return df

    # --------------------------------------------------
    # ENCODE CATEGORICAL FEATURES
    # --------------------------------------------------

    def encode(self, df, fit=False):

        df = df.copy()

        categorical = [
            col
            for col in CATEGORICAL_COLUMNS
            if col in df.columns
        ]

        if not categorical:
            return df

        numeric = df.drop(
            columns=categorical
        )

        if fit:

            self.encoder = OneHotEncoder(
                handle_unknown="ignore",
                sparse_output=False
            )

            encoded = self.encoder.fit_transform(
                df[categorical]
            )

        else:

            if self.encoder is None:
                raise ValueError(
                    "Encoder has not been loaded."
                )

            encoded = self.encoder.transform(
                df[categorical]
            )

        encoded_df = pd.DataFrame(

            encoded,

            columns=self.encoder.get_feature_names_out(
                categorical
            ),

            index=df.index

        )

        return pd.concat(
            [
                numeric,
                encoded_df
            ],
            axis=1
        )

    # --------------------------------------------------
    # ALIGN FEATURES WITH TRAINING SCALER
    # --------------------------------------------------

    def align_with_scaler(self, df):

        df = df.copy()

        if self.scaler is None:
            raise ValueError(
                "Scaler has not been loaded."
            )

        expected_features = list(
            self.scaler.feature_names_in_
        )

        # Add missing columns expected by scaler
        for feature in expected_features:

            if feature not in df.columns:

                df[feature] = 0

        # Remove unexpected columns
        df = df[
            expected_features
        ]

        return df

    # --------------------------------------------------
    # SCALE FEATURES
    # --------------------------------------------------

    def scale(self, df, fit=False):

        df = df.copy()

        if fit:

            self.scaler = RobustScaler()

            scaled = self.scaler.fit_transform(
                df
            )

            columns = df.columns

        else:

            if self.scaler is None:
                raise ValueError(
                    "Scaler has not been fitted."
                )

            # Ensure exact same features as training
            df = self.align_with_scaler(df)

            scaled = self.scaler.transform(
                df
            )

            columns = list(
                self.scaler.feature_names_in_
            )

        return pd.DataFrame(

            scaled,

            columns=columns,

            index=df.index

        )

    # --------------------------------------------------
    # FEATURE SELECTION
    # --------------------------------------------------

    def select_features(self, df, fit=False):

        df = df.copy()

        if fit:

            corr = df.corr().abs()

            upper = corr.where(

                np.triu(
                    np.ones(
                        corr.shape
                    ),
                    k=1
                ).astype(bool)

            )

            drop_cols = [

                column

                for column in upper.columns

                if any(
                    upper[column]
                    > CORRELATION_THRESHOLD
                )

            ]

            self.selected_features = [

                column

                for column in df.columns

                if column not in drop_cols

            ]

        else:

            # Add missing selected features
            for feature in self.selected_features:

                if feature not in df.columns:

                    df[feature] = 0

            # Keep exact training feature order
            df = df[
                self.selected_features
            ]

        return df

    # --------------------------------------------------
    # PCA
    # --------------------------------------------------

    def apply_pca(self, df, fit=False):

        if fit:

            self.pca = PCA(

                n_components=PCA_VARIANCE_RETAINED,

                random_state=42

            )

            transformed = self.pca.fit_transform(
                df
            )

        else:

            if self.pca is None:

                raise ValueError(
                    "PCA has not been loaded."
                )

            transformed = self.pca.transform(
                df
            )

        columns = [

            f"PC{i + 1}"

            for i in range(
                transformed.shape[1]
            )

        ]

        return pd.DataFrame(

            transformed,

            columns=columns,

            index=df.index

        )

    # --------------------------------------------------
    # TRAINING PIPELINE
    # --------------------------------------------------

    def fit_transform(self, df):

        df = df.copy()

        # Remove target columns
        for column in [
            "label",
            "category"
        ]:

            if column in df.columns:

                df.drop(
                    columns=column,
                    inplace=True
                )

        df = self.clean(df)

        df = self.encode(
            df,
            fit=True
        )

        df = self.scale(
            df,
            fit=True
        )

        df = self.select_features(
            df,
            fit=True
        )

        df = self.apply_pca(
            df,
            fit=True
        )

        BASE_DIR = os.path.dirname(
            os.path.dirname(
                os.path.abspath(__file__)
            )
        )

        MODELS_DIR = os.path.join(
            BASE_DIR,
            "models"
        )

        os.makedirs(
            MODELS_DIR,
            exist_ok=True
        )

        joblib.dump(

            self.encoder,

            os.path.join(
                MODELS_DIR,
                "encoder.pkl"
            )

        )

        joblib.dump(

            self.scaler,

            os.path.join(
                MODELS_DIR,
                "scaler.pkl"
            )

        )

        joblib.dump(

            self.selected_features,

            os.path.join(
                MODELS_DIR,
                "selected_features.pkl"
            )

        )

        joblib.dump(

            self.pca,

            os.path.join(
                MODELS_DIR,
                "pca.pkl"
            )

        )

        return df

    # --------------------------------------------------
    # PREDICTION PIPELINE
    # --------------------------------------------------

    def transform(self, df):

        df = df.copy()

        # Remove target columns if present
        for column in [
            "label",
            "category"
        ]:

            if column in df.columns:

                df.drop(
                    columns=column,
                    inplace=True
                )

        df = self.clean(df)

        # Encode categorical columns
        df = self.encode(
            df,
            fit=False
        )

        # Force exact feature structure expected by scaler
        df = self.align_with_scaler(
            df
        )

        # Scale
        df = self.scale(
            df,
            fit=False
        )

        # Select exact features used during training
        df = self.select_features(
            df,
            fit=False
        )

        # PCA transformation
        df = self.apply_pca(
            df,
            fit=False
        )

        return df


# --------------------------------------------------
# UPLOADED FILE PREPROCESSING
# --------------------------------------------------

def preprocess_uploaded_file(file_path):

    df = pd.read_csv(

        file_path,

        header=None,

        names=NSL_KDD_COLUMNS

    )

    preprocessor = DataPreprocessor()

    return preprocessor.transform(
        df
    )


# --------------------------------------------------
# TEST / TRAIN MODE
# --------------------------------------------------

if __name__ == "__main__":

    from ml_pipeline.loader import (
        load_train_test,
        map_attack_categories,
    )

    train_df, test_df = load_train_test()

    train_df = map_attack_categories(
        train_df
    )

    test_df = map_attack_categories(
        test_df
    )

    preprocessor = DataPreprocessor()

    X_train = preprocessor.fit_transform(
        train_df
    )

    X_test = preprocessor.transform(
        test_df
    )

    print(
        "Processed train shape:",
        X_train.shape
    )

    print(
        "Processed test shape:",
        X_test.shape
    )