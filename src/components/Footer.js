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
    paddingVertical: 8,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#e5e5e5',
  },
  text: {
    fontSize: 12,
    color: '#555',
  },
  link: {
    color: '#000',
    fontWeight: '600',
  },
});
