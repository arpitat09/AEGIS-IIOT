import os
from ml_pipeline.preprocess import preprocess_uploaded_file

file_path = os.path.join(os.path.dirname(__file__), "uploads", "KDDTest+.txt")
if not os.path.exists(file_path):
    file_path = os.path.join(os.path.dirname(__file__), "uploads", "test_sample.txt")

data = preprocess_uploaded_file(file_path)

print("Preprocessed Data Head:")
print(data.head())
print("Data Shape:", data.shape)