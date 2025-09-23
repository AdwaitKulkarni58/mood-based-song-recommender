import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const MoodOptions = ({ moods, navigation }) => {
  return (
    <View style={styles.optionsContainer}>
      {moods.map((mood) => (
        <TouchableOpacity
          key={mood.value}
          style={styles.button}
          onPress={() => navigation.navigate("Results", { mood })}
        >
          <Text style={styles.buttonText}>{mood.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  optionsContainer: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#114B5F",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginVertical: 8,
    width: "90%",
    alignItems: "center",
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default MoodOptions;
