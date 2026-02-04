import React from 'react';
import { View, StyleSheet } from 'react-native';
import Footer from './Footer';

export default function ScreenLayout({ children }) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>{children}</View>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
});
