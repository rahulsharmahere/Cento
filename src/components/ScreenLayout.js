import React from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default function ScreenLayout({ children }) {
  return (
    <LinearGradient
      colors={[
        '#383853',   // ✨ Lifted cinematic dark
        '#3c3c6d',   // Premium depth tone
        '#121224',   // Cinematic base
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
