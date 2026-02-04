import React from 'react';
import {
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

export default function SceneCard({ scene, imageUrl, onPress, style }) {
  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={() => onPress(scene.id)}
      activeOpacity={0.85}
    >
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <Text numberOfLines={2} style={styles.title}>
        {scene.title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1, // 🔥 important for grid
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    backgroundColor: '#ccc',
  },
  title: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '500',
  },
});
