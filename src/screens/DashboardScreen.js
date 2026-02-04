import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { graphqlRequest } from '../services/graphql';
import { getServerConfig } from '../utils/storage';

export default function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const { serverUrl, apiKey } = await getServerConfig();

      const data = await graphqlRequest(
        serverUrl,
        apiKey,
        `{ version { version hash build_time } }`
      );

      setInfo(data.version);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Dashboard</Text>

      <View style={styles.card}>
        <Text>Version: {info.version}</Text>
        <Text>Hash: {info.hash}</Text>
        <Text>Build Time: {info.build_time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  heading: { fontSize: 22, fontWeight: '600', marginBottom: 20 },
  card: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
