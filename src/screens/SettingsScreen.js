import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import ScreenLayout from '../components/ScreenLayout';
import AppHeader from '../components/AppHeader';
import { clearServerConfig } from '../utils/storage';

export default function SettingsScreen({ navigation }) {
  const logout = async () => {
    await clearServerConfig();
    navigation.replace('Login');
  };

  return (
    <ScreenLayout>
      <AppHeader />
      <View style={styles.body}>
        <Text style={styles.title}>Settings</Text>

        <TouchableOpacity style={styles.button} onPress={logout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  body: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
