import React from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default function ScreenLayout({ children }) {
  return (
    <LinearGradient
      colors={[
        '#0b0b0f',   // Deep cinematic black
        '#11111a',   // Slight lifted tone
        '#0b0b0f',   // Back to black
      ]}
      style={styles.container}
    >
      <View style={styles.content}>{children}</View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
