from services.preprocessing import preprocess_dataset

data = preprocess_dataset("uploads/KDDTest+.txt")

print(data.head())
print(data.shape)