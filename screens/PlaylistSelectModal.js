import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { BACKEND_URL } from "../config";
import { getToken } from "../utils/auth";

const PlaylistSelectModal = ({ visible, onClose, onSelect, song }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState("");

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    getToken().then((token) => {
      fetch(`${BACKEND_URL}/api/playlists`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setPlaylists(data.playlists || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    });
  }, [visible]);

  const handleCreate = () => {
    if (!newPlaylist) return;
    setLoading(true);
    getToken().then((token) => {
      fetch(`${BACKEND_URL}/api/playlists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newPlaylist }),
      })
        .then((res) => res.json())
        .then((data) => {
          setPlaylists(data.playlists || []);
          setNewPlaylist("");
          setLoading(false);
        })
        .catch(() => setLoading(false));
    });
  };

  const handleAddToPlaylist = (playlistName) => {
    setLoading(true);
    getToken().then((token) => {
      fetch(
        `${BACKEND_URL}/api/playlists/${encodeURIComponent(playlistName)}/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ song }),
        }
      )
        .then((res) => res.json())
        .then(() => {
          setLoading(false);
          onSelect && onSelect(playlistName);
        })
        .catch(() => setLoading(false));
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Select Playlist</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#1DB954" />
          ) : (
            <>
              <FlatList
                data={playlists}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.playlistItem}
                    onPress={() => handleAddToPlaylist(item.name)}
                  >
                    <Text style={styles.playlistName}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <Text style={styles.empty}>No playlists found.</Text>
                }
              />
              <View style={styles.createRow}>
                <TextInput
                  style={styles.input}
                  placeholder="New playlist name"
                  value={newPlaylist}
                  onChangeText={setNewPlaylist}
                />
                <TouchableOpacity
                  style={styles.createButton}
                  onPress={handleCreate}
                >
                  <Text style={styles.createButtonText}>Create</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    width: "90%",
    maxHeight: "80%",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  playlistItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  playlistName: { fontSize: 16 },
  empty: { textAlign: "center", color: "#888", marginVertical: 16 },
  createRow: { flexDirection: "row", alignItems: "center", marginTop: 16 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
  },
  createButton: {
    backgroundColor: "#1DB954",
    padding: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
  createButtonText: { color: "#fff", fontWeight: "bold" },
  closeButton: { marginTop: 18, alignSelf: "center" },
  closeButtonText: { color: "#1DB954", fontSize: 16 },
});

export default PlaylistSelectModal;
