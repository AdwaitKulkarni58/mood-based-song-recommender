import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { BACKEND_URL } from "../config";
import { getToken } from "../utils/auth";

const InsightsScreen = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getToken().then((token) => {
      fetch(`${BACKEND_URL}/api/insights`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch insights");
          return res.json();
        })
        .then((data) => {
          setInsights(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    });
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Your Insights</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#1DB954" style={{ marginTop: 40 }} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : insights ? (
        <View>
          {insights.cluster !== undefined && (
            <Text style={styles.insightText}>
              You belong to cluster: <Text style={styles.cluster}>{insights.cluster}</Text>
            </Text>
          )}
          {insights.summary && (
            <Text style={styles.insightText}>{insights.summary}</Text>
          )}
          {/* Add more insights display as needed */}
        </View>
      ) : (
        <Text style={styles.insightText}>No insights available yet.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#F8F8FF",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#1DB954",
  },
  insightText: {
    fontSize: 18,
    marginBottom: 16,
    color: "#333",
    textAlign: "center",
  },
  cluster: {
    fontWeight: "bold",
    color: "#1DB954",
  },
  error: {
    color: "red",
    fontSize: 16,
    marginTop: 20,
  },
});

export default InsightsScreen;
