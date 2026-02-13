import React from 'react';
import {
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SceneCard({ scene, imageUrl, onPress, style }) {
  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={() => onPress(scene.id)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: imageUrl }} style={styles.image} />

      {/* 🎬 Cinematic Overlay */}
      <View style={styles.overlay} />

      {/* 🎬 Floating Title */}
      <View style={styles.textContainer}>
        <Text numberOfLines={2} style={styles.title}>
          {scene.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: 140,

    borderRadius: 14,
    overflow: 'hidden',

    backgroundColor: '#15151d',

    /* ✨ PREMIUM SHADOW */
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,

    elevation: 8,   // ✅ Android shadow
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
    height: 55,

    backgroundColor: 'rgba(0,0,0,0.55)',
  },

  textContainer: {
    position: 'absolute',
    bottom: 8,
    left: 10,
    right: 10,
  },

  title: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',

    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowRadius: 6,
  },
});