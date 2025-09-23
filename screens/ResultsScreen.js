import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const ResultsScreen = ({ route }) => {
  const { mood } = route.params || {};
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Results for: {mood ? mood.label : "..."}</Text>
      <FlatList
        data={[]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.title}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.placeholder}>No results yet. (Placeholder)</Text>
        }
      />
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
  },
  placeholder: {
    textAlign: "center",
    color: "#888",
    marginTop: 40,
  },
});

export default ResultsScreen;
