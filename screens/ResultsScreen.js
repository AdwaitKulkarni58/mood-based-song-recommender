import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Linking,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { BACKEND_URL } from "../config";

const ResultsScreen = ({ route }) => {
  const { mood } = route.params || {};
  const moodKey = mood?.value || mood?.toLowerCase();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(
      `${BACKEND_URL}/api/recommendations?mood=${moodKey}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch recommendations");
        return res.json();
      })
      .then((data) => {
        setTracks(data.tracks || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [moodKey]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Results for: {mood?.label || moodKey || "..."}
      </Text>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#1DB954"
          style={{ marginTop: 40 }}
        />
      ) : error ? (
        <Text style={styles.placeholder}>{error}</Text>
      ) : (
        <FlatList
          data={tracks}
          keyExtractor={(item, index) =>
            item.spotify_id || item.id || index.toString()
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() =>
                Linking.openURL(
                  item.url ||
                    `https://open.spotify.com/track/${
                      item.spotify_id || item.id
                    }`
                )
              }
            >
              <Text style={styles.trackTitle}>{item.title || item.name}</Text>
              <Text style={styles.artist}>
                {item.artist ||
                  (item.artists
                    ? item.artists.map((a) => a.name).join(", ")
                    : "")}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.placeholder}>No results for this mood</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFEFD3",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
  artist: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  placeholder: {
    textAlign: "center",
    color: "#888",
    marginTop: 40,
  },
});

export default ResultsScreen;
