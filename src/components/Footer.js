import React from 'react';
import { View, Text, Linking, StyleSheet } from 'react-native';

export default function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.text}>
        Designed by{' '}
        <Text
          style={styles.link}
          onPress={() => Linking.openURL('https://www.rahulsharmahere.com')}
        >
          Rahul Sharma
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingVertical: 10,
    alignItems: 'center',

    backgroundColor: 'rgba(20,20,30,0.95)',
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },

  text: {
    fontSize: 12,
    color: '#a1a1aa',     // ✅ Proper cinematic grey
    fontWeight: '400',
  },

  link: {
    color: '#7c3aed',
    fontWeight: '600',
  },
});
