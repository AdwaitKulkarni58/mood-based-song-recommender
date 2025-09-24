import requests
import pandas as pd
from sklearn.cluster import KMeans
import json

# Config
BACKEND_URL = "http://localhost:8888"  # Change if needed

# 1. Fetch user interaction data from backend
resp = requests.get(f"{BACKEND_URL}/api/interactions/all")
resp.raise_for_status()
data = resp.json()["interactions"]

# 2. Convert to DataFrame
# We'll use mood and playlistName for clustering
if not data:
    print("No interaction data found.")
    exit()
df = pd.DataFrame(data)

# Encode categorical features
from sklearn.preprocessing import LabelEncoder
le_mood = LabelEncoder()
le_playlist = LabelEncoder()
df["mood_enc"] = le_mood.fit_transform(df["mood"])
df["playlist_enc"] = le_playlist.fit_transform(df["playlistName"])

# 3. K-Means clustering
X = df[["mood_enc", "playlist_enc"]]
n_clusters = min(5, len(df))  # Up to 5 clusters or as many as data points
kmeans = KMeans(n_clusters=n_clusters, random_state=42)
df["cluster"] = kmeans.fit_predict(X)

# 4. Output cluster assignments
print("Cluster assignments:")
print(df[["userId", "mood", "playlistName", "cluster"]])

# Save to CSV for backend/frontend use
df[["userId", "mood", "playlistName", "cluster"]].to_csv("user_clusters.csv", index=False)
print("Cluster assignments saved to user_clusters.csv")
