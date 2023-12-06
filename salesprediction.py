import modin.pandas as pd
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import pickle

# Load the dataset as an example
df = pd.read_excel('encoded_sample.xlsx')

X = df.iloc[:, :-1]
y = df.purchase_decision

# Scale numerical features using StandardScaler
scaler = StandardScaler()
X = scaler.fit_transform(X)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)

# Create a Random Forest Classifier using Intel optimized scikit-learn
clf = RandomForestClassifier(n_estimators=100)
# Fit the model on the training data
clf.fit(X_train, y_train)
# Make predictions on the scaled test data
y_pred = clf.predict(X_test)

# Decode the predictions back to original labels
label_encoder = LabelEncoder()
label_encoder.fit(y)
y_pred_decoded = label_encoder.inverse_transform(y_pred)

# Evaluate the model
accuracy = accuracy_score(y_test, y_pred_decoded)
print(f"Accuracy: {accuracy}")

# Save the model to disk
filename = 'finalized_model.sav'
pickle.dump(clf, open(filename, 'wb'))

# Load the model and make predictions
loaded_model = pickle.load(open(filename, 'rb'))
result = loaded_model.predict(X_test)
accuracy = accuracy_score(y_test, result)
print(f"Accuracy: {accuracy}")








# from sklearn.preprocessing import StandardScaler, LabelEncoder
# from sklearn.metrics import accuracy_score
# from sklearn.model_selection import train_test_split
# from sklearn.ensemble import RandomForestClassifier
# import pickle
# import pandas as pd
# from sklearnex import patch_sklearn
# patch_sklearn()

# # Load the  dataset as an example
# df = pd.read_excel('encoded_sample.xlsx')
# X = df.iloc[:, :-1]
# y = df.purchase_decision
# # Scale numerical features using StandardScaler
# scaler = StandardScaler()
# X = scaler.fit_transform(X)
# # y = scaler.transform(y)


# X_train, X_test, y_train, y_test = train_test_split(
#     X, y, test_size=0.2, random_state=42)


# # Create a Random Forest Classifier using Intel optimized scikit-learn
# clf = RandomForestClassifier(n_estimators=100)
# # Fit the model on the training data
# clf.fit(X_train, y_train)
# # Make predictions on the scaled test data
# y_pred = clf.predict(X_test)

# # Decode the predictions back to original labels
# y_pred_decoded = label_encoder.inverse_transform(y_pred)
# # Evaluate the model
# accuracy = accuracy_score(y_test, y_pred_decoded)
# print(f"Accuracy: {accuracy}")

# # save the model to disk
# filename = 'finalized_model.sav'
# pickle.dump(clf, open(filename, 'wb'))

# loaded_model = pickle.load(open(filename, 'rb'))
# result = loaded_model.predict(X_test)
# accuracy = accuracy_score(y_test, y_pred_decoded)
# print(f"Accuracy: {accuracy}")
