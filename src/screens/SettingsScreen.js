import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

import ScreenLayout from '../components/ScreenLayout';
import AppHeader from '../components/AppHeader';

import { useUpdate } from '../context/UpdateContext';
import { trackEvent } from '../services/matomo';

const SettingsScreen = ({ navigation }) => {
  const { manualCheckForUpdate } = useUpdate();

  const handleCheckUpdate = () => {
    trackEvent('settings', 'check_update_clicked');
    manualCheckForUpdate();
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            trackEvent('settings', 'logout_clicked');
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  return (
    <ScreenLayout>
      <AppHeader title="Settings" />

      <View style={styles.container}>

        {/* 🔥 Update Card */}
        <TouchableOpacity
          style={styles.glassCard}
          activeOpacity={0.85}
          onPress={handleCheckUpdate}
        >
          <Text style={styles.cardTitle}>App Updates</Text>
          <Text style={styles.cardSubtitle}>
            Check for new versions
          </Text>
        </TouchableOpacity>

        {/* 🔥 Logout Card */}
        <TouchableOpacity
          style={[styles.glassCard, styles.logoutCard]}
          activeOpacity={0.85}
          onPress={handleLogout}
        >
          <Text style={styles.logoutTitle}>Logout</Text>
          <Text style={styles.cardSubtitle}>
            Sign out from Cento
          </Text>
        </TouchableOpacity>

      </View>
    </ScreenLayout>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({

  container: {
    paddingHorizontal: 14,
    paddingTop: 10,
  },

  glassCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },

  logoutCard: {
    marginTop: 6,
    backgroundColor: 'rgba(127,29,29,0.35)',   // subtle destructive tone
    borderColor: 'rgba(255,80,80,0.25)',
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },

  logoutTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fca5a5',   // cinematic red highlight
  },

  cardSubtitle: {
    fontSize: 12,
    color: '#a1a1aa',
    marginTop: 4,
  },
});
