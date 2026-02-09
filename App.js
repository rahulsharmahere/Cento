import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigator from './src/navigation/AppNavigator';
import UpdateModal from './src/components/UpdateModal';
import { UpdateProvider } from './src/context/UpdateContext';
import { trackEvent } from './src/services/matomo';

export default function App() {

  // 🔥 App open tracking (runs once)
  useEffect(() => {
    trackEvent('app', 'open', 'cold_start');
  }, []);

  return (
    <SafeAreaProvider>
      <UpdateProvider>
        <>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>

          <UpdateModal />
        </>
      </UpdateProvider>
    </SafeAreaProvider>
  );
}
