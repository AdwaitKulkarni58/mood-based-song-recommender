import { StyleSheet, ScrollView, TouchableOpacity, Text, View } from "react-native";
import { Divider } from "react-native-paper";

import MoodOptions from "../components/MoodOptions";

const moods = [
  { label: "Happy / Joyful", value: "happy" },
  { label: "Sad / Melancholy", value: "sad" },
  { label: "Chill / Relaxed", value: "chill" },
  { label: "Energetic / Pumped", value: "energetic" },
  { label: "Romantic / Love", value: "romantic" },
  { label: "Focused / Study / Work", value: "focused" },
  { label: "Party / Hype", value: "party" },
  { label: "Angry / Intense", value: "angry" },
  { label: "Calm / Sleepy", value: "calm" },
  { label: "Motivated / Confident", value: "motivated" },
];

const HomeScreen = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => navigation.navigate("Profile")}
      >
        <Text style={styles.profileButtonText}>Go to Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.profileButton, { backgroundColor: '#3A86FF', marginBottom: 16 }]}
        onPress={() => navigation.navigate("Insights")}
      >
        <Text style={styles.profileButtonText}>View Insights</Text>
      </TouchableOpacity>
      <View style={styles.divider} />
      <Divider theme={{ colors: { primary: "green" } }} />
      <MoodOptions moods={moods} navigation={navigation} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFEFD3",
  },
  profileButton: {
    backgroundColor: "#1DB954",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 36,
    alignSelf: "center",
    width: "90%",
    elevation: 2,
  },
  profileButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'black',
    alignSelf: 'stretch',
    marginVertical: 12,
    width: '100%',
  },
});

export default HomeScreen;
