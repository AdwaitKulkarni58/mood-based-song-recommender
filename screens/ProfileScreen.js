import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { BACKEND_URL } from "../config";
import { getToken, removeToken } from "../utils/auth";

const ProfileScreen = ({ navigation }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPlaylists = async () => {
    setLoading(true);
    const token = await getToken();
    if (!token) {
      Alert.alert("Not logged in", "Please log in to view your playlists.");
      navigation.replace("Login");
      return;
    }
    fetch(`${BACKEND_URL}/api/playlists`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setPlaylists(data.playlists || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleLogout = async () => {
    await removeToken();
    navigation.replace("Login");
  };

  const handleDeletePlaylist = async (name) => {
    const token = await getToken();
    fetch(`${BACKEND_URL}/api/playlists/${encodeURIComponent(name)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => fetchPlaylists());
  };

  const handleDeleteSong = async (playlistName, songId) => {
    const token = await getToken();
    fetch(
      `${BACKEND_URL}/api/playlists/${encodeURIComponent(
        playlistName
      )}/song/${encodeURIComponent(songId)}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    ).then(() => fetchPlaylists());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Playlists</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#1DB954" />
      ) : (
        <FlatList
          data={playlists}
          keyExtractor={(item) => item.name}
          refreshing={refreshing}
          onRefresh={fetchPlaylists}
          renderItem={({ item }) => (
            <View style={styles.playlistBox}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.playlistName}>{item.name}</Text>
                <TouchableOpacity
                  onPress={() => handleDeletePlaylist(item.name)}
                >
                  <Text style={styles.delete}>Delete Playlist</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={item.songs}
                keyExtractor={(song) => song.spotify_id || song.title}
                renderItem={({ item: song }) => (
                  <View style={styles.songRow}>
                    <Text style={styles.songTitle}>
                      {song.title} - {song.artist}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        handleDeleteSong(item.name, song.spotify_id)
                      }
                    >
                      <Text style={styles.delete}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                )}
                ListEmptyComponent={
                  <Text style={styles.empty}>No songs in this playlist.</Text>
                }
              />
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>No playlists found.</Text>
          }
        />
      )}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  playlistBox: {
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
    padding: 14,
    marginBottom: 18,
  },
  playlistName: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  songRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  songTitle: { fontSize: 15, width: "80%" },
  delete: { color: "#e74c3c", fontWeight: "bold", marginLeft: 10 },
  empty: { color: "#888", textAlign: "center", marginVertical: 8 },
  logoutButton: {
    backgroundColor: "#1DB954",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  logoutText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default ProfileScreen;
