import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import { authenticateBiometric } from '../services/biometric';

export default function BiometricGateScreen({ onSuccess }) {

  useEffect(() => {
    unlock();
  }, []);

  const unlock = async () => {
    const success = await authenticateBiometric();

    if (success) {
      onSuccess();
    }
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#7c3aed" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f14',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
