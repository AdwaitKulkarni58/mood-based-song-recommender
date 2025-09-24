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
  const [visibleCount, setVisibleCount] = useState(10); // For pagination

  useEffect(() => {
    setLoading(true);
    setError(null);
    setVisibleCount(10); // Reset pagination on mood change
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
        <>
          <FlatList
            data={tracks.slice(0, visibleCount)}
            keyExtractor={(item, index) =>
              item.spotify_id || item.id || index.toString()
            }
            renderItem={({ item }) => {
              // Format duration from ms to mm:ss
              const formatDuration = (ms) => {
                if (!ms && ms !== 0) return '';
                const totalSeconds = Math.floor(ms / 1000);
                const minutes = Math.floor(totalSeconds / 60);
                const seconds = totalSeconds % 60;
                return `${minutes}:${seconds.toString().padStart(2, '0')}`;
              };
              return (
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
                  {item.album && (
                    <Text style={styles.album}>Album: {item.album}</Text>
                  )}
                  {item.duration_ms !== undefined && (
                    <Text style={styles.duration}>Duration: {formatDuration(item.duration_ms)}</Text>
                  )}
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <Text style={styles.placeholder}>No results for this mood</Text>
            }
          />
          {visibleCount < tracks.length && (
            <TouchableOpacity
              style={styles.showMoreButton}
              onPress={() => setVisibleCount((prev) => prev + 10)}
            >
              <Text style={styles.showMoreText}>Show More</Text>
            </TouchableOpacity>
          )}
        </>
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
  album: {
    fontSize: 13,
    color: '#444',
    marginTop: 2,
  },
  duration: {
    fontSize: 13,
    color: '#888',
    marginTop: 1,
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
  showMoreButton: {
    backgroundColor: '#1DB954',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
    alignSelf: 'center',
    minWidth: 120,
  },
  showMoreText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ResultsScreen;
