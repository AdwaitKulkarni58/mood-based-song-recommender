import { StyleSheet, ScrollView } from "react-native";

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
  const handleContinue = () => {
    // Optionally, you can set a flag in navigation params or context to indicate guest mode
    // For now, just allow navigation to mood selection as usual
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
});

export default HomeScreen;
