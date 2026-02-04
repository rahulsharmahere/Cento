import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { getServerConfig } from '../utils/storage';

export default function BootstrapScreen({ navigation }) {
  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    const { serverUrl, apiKey } = await getServerConfig();

    if (serverUrl && apiKey) {
      navigation.replace('Main');
    } else {
      navigation.replace('Login');
    }
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
