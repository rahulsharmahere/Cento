import React, { useEffect, useState, useRef } from 'react';
import { AppState } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BootstrapScreen from '../screens/BootstrapScreen';
import LoginScreen from '../screens/LoginScreen';
import MainTabs from './MainTabs';

import BiometricGateScreen from '../screens/BiometricGateScreen';
import { getBiometricEnabled } from '../utils/storage';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [biometricEnabled, setBiometricEnabledState] = useState(null);
  const [unlocked, setUnlocked] = useState(false);

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    init();

    const sub = AppState.addEventListener('change', nextState => {
      if (
        appState.current.match(/background|inactive/) &&
        nextState === 'active'
      ) {
        handleResumeLock();
      }

      appState.current = nextState;
    });

    return () => sub.remove();
  }, []);

  const init = async () => {
    const enabled = await getBiometricEnabled();
    setBiometricEnabledState(enabled);

    if (enabled) {
      console.log('🔒 App Launch → Lock Required');
      setUnlocked(false);
    } else {
      setUnlocked(true);
    }
  };

  const handleResumeLock = async () => {
    const enabled = await getBiometricEnabled();

    if (enabled) {
      console.log('🔒 App Resumed → Locking Again');
      setUnlocked(false);
    }
  };

  if (biometricEnabled === null) return null;

  if (biometricEnabled && !unlocked) {
    return (
      <BiometricGateScreen
        onSuccess={() => {
          console.log('✅ Biometric Success → Unlock');
          setUnlocked(true);
        }}
      />
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Bootstrap" component={BootstrapScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Main" component={MainTabs} />
    </Stack.Navigator>
  );
}
