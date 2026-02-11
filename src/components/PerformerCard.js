import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { getServerConfig } from '../utils/storage';

export default function PerformerCard({ performer }) {
  const [config, setConfig] = React.useState(null);

  React.useEffect(() => {
    getServerConfig().then(setConfig);
  }, []);

  if (!config) return null;

  const imageUrl = `${config.serverUrl}/performer/${performer.id}/image?apikey=${config.apiKey}`;

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* 🎬 Cinematic Overlay */}
      <View style={styles.overlay} />

      {/* 🎬 Floating Performer Name */}
      <View style={styles.textContainer}>
        <Text numberOfLines={1} style={styles.name}>
          {performer.name}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 120,
    height: 165,

    borderRadius: 16,
    overflow: 'hidden',              // ✅ Critical
    marginRight: 12,

    backgroundColor: '#15151d',      // Cinematic fallback
  },

  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#222',
  },

  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 45,

    backgroundColor: 'rgba(0,0,0,0.55)',   // 🎬 Cinematic fade
  },

  textContainer: {
    position: 'absolute',
    bottom: 8,
    left: 6,
    right: 6,
  },

  name: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',

    textShadowColor: 'rgba(0,0,0,0.85)',   // 🔥 Premium readability trick
    textShadowRadius: 6,
  },
});
