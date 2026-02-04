import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenLayout from '../components/ScreenLayout';
import AppHeader from '../components/AppHeader';

export default function TagsScreen() {
  return (
    <ScreenLayout>
      <AppHeader />
      <View style={styles.body}>
        <Text>Tags</Text>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  body: { padding: 16 },
});
