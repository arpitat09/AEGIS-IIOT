import pandas as pd

from services.predictor import predict_features


def predict_realtime(
    features,
    metadata
):

    df = pd.DataFrame(
        [features]
    )


    result = predict_features(
        df,
        metadata=metadata
    )


    return result[0]