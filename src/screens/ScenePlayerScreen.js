import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import Video from 'react-native-video';
import { useFocusEffect } from '@react-navigation/native';

import ScreenLayout from '../components/ScreenLayout';
import AppHeader from '../components/AppHeader';
import { getServerConfig } from '../utils/storage';

export default function ScenePlayerScreen({ route }) {
  const { sceneId } = route.params;

  const [videoUrl, setVideoUrl] = useState(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    buildVideoUrl();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // ✅ Screen focused → play
      setPaused(false);

      return () => {
        // ✅ Leaving screen → pause
        setPaused(true);
      };
    }, [])
  );

  const buildVideoUrl = async () => {
    const { serverUrl, apiKey } = await getServerConfig();
    setVideoUrl(`${serverUrl}/scene/${sceneId}/stream?apikey=${apiKey}`);
  };

  if (!videoUrl) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScreenLayout>
      <AppHeader title="Now Playing" showBack />

      <Video
        source={{ uri: videoUrl }}
        style={styles.video}
        controls
        resizeMode="contain"

        // ✅ Playback Control
        paused={paused}

        fullscreen
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  video: {
    width: '100%',
    height: 260,
    backgroundColor: '#000',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
