import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigator from './src/navigation/AppNavigator';
import UpdateModal from './src/components/UpdateModal';
import { checkForUpdate } from './src/services/updateService';
import { downloadAndInstallApk } from './src/services/apkInstaller';

import pkg from './package.json';

export default function App() {
  const [updateInfo, setUpdateInfo] = useState(null);
  const [showUpdate, setShowUpdate] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const cancelRef = useRef(null);

  // 🔍 Check for update on app start
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const info = await checkForUpdate(pkg.version);
        if (mounted && info) {
          setUpdateInfo(info);
          setShowUpdate(true);
        }
      } catch (e) {
        // silent fail – never block app start
        console.log('Update check failed', e);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // ⬇️ Start update
  const startUpdate = async () => {
    if (!updateInfo) return;

    setDownloading(true);
    setProgress(0);

    try {
      await downloadAndInstallApk(
        updateInfo.downloadUrl,
        setProgress,
        cancelRef
      );
    } catch (e) {
      console.log('Update failed', e);
      setDownloading(false);
    }
  };

  // ❌ Cancel download
  const cancelDownload = () => {
    cancelRef.current?.();
    setDownloading(false);
    setShowUpdate(false);
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>

      {/* 🔔 Update Modal (global) */}
      <UpdateModal
        visible={showUpdate}
        downloading={downloading}
        progress={progress}
        onUpdate={startUpdate}
        onLater={() => setShowUpdate(false)}
        onCancel={cancelDownload}
      />
    </SafeAreaProvider>
  );
}
