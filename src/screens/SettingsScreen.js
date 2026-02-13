import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
  Linking,
} from 'react-native';

import ScreenLayout from '../components/ScreenLayout';
import AppHeader from '../components/AppHeader';

import { useUpdate } from '../context/UpdateContext';
import { trackEvent } from '../services/matomo';

import {
  setBiometricEnabled,
  getBiometricEnabled,
} from '../utils/storage';

import { authenticateBiometric } from '../services/biometric';

const SettingsScreen = ({ navigation }) => {
  const { manualCheckForUpdate } = useUpdate();
  const [biometricEnabled, setBiometric] = useState(false);

  useEffect(() => {
    loadSetting();
  }, []);

  const loadSetting = async () => {
    const enabled = await getBiometricEnabled();
    setBiometric(enabled);
  };

  const handleBiometricToggle = async (value) => {

    // ✅ Turning OFF → VERIFY FIRST
    if (!value && biometricEnabled) {
      const success = await authenticateBiometric();

      if (!success) {
        Alert.alert('Authentication Required');
        return;
      }
    }

    // ✅ Turning ON → VERIFY FIRST
    if (value && !biometricEnabled) {
      const success = await authenticateBiometric();

      if (!success) {
        Alert.alert('Authentication Failed');
        return;
      }
    }

    await setBiometricEnabled(value);
    setBiometric(value);
  };

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

        {/* ✅ Biometric Toggle */}
        <View style={styles.glassCard}>
          <Text style={styles.cardTitle}>Biometric Lock</Text>
          <Text style={styles.cardSubtitle}>
            Secure app with fingerprint / face
          </Text>

          <Switch
            value={biometricEnabled}
            onValueChange={handleBiometricToggle}
            trackColor={{ true: '#7c3aed' }}
            thumbColor={biometricEnabled ? '#ffffff' : '#d4d4d8'}
            style={{ marginTop: 10 }}
          />
        </View>

        {/* ✅ About Section */}
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>About</Text>

          <Text style={styles.aboutText}>
            This is the unofficial Android App of StashApp
          </Text>

          <Text style={styles.aboutText}>
            Developed and managed by{' '}
            <Text
              style={styles.link}
              onPress={() => Linking.openURL('https://rahulsharmahere.com')}
            >
              Rahul Sharma
            </Text>
          </Text>

          <Text
            style={styles.projectLink}
            onPress={() =>
              Linking.openURL('https://github.com/rahulsharmahere/Cento')
            }
          >
            Check Project Page on GitHub →
          </Text>
        </View>

        {/* ✅ Action Buttons */}
        <TouchableOpacity
          style={[styles.actionButton, styles.updateButton]}
          activeOpacity={0.85}
          onPress={handleCheckUpdate}
        >
          <Text style={styles.buttonText}>Check for Updates</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.logoutButton]}
          activeOpacity={0.85}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Logout</Text>
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
    marginBottom: 18,

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },

  aboutCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 22,

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },

  cardSubtitle: {
    fontSize: 12,
    color: '#a1a1aa',
    marginTop: 4,
  },

  aboutTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#7c3aed',
    marginBottom: 10,
  },

  aboutText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#e4e4e7',
    marginBottom: 4,
  },

  link: {
    color: '#a78bfa',
    fontWeight: '600',
  },

  projectLink: {
    marginTop: 10,
    fontSize: 12,
    color: '#7c3aed',
    fontWeight: '600',
  },

  actionButton: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,

    elevation: 6,
  },

  updateButton: {
    backgroundColor: '#7c3aed',
  },

  logoutButton: {
    backgroundColor: '#ef4444',
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
