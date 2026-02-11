import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function StatsCard({ label, count, icon }) {
  return (
    <View style={styles.card}>

      <View style={styles.iconWrapper}>
        <Icon name={icon} size={22} color="#7c3aed" />
      </View>

      <Text style={styles.count}>{count}</Text>
      <Text style={styles.label}>{label}</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 125,                     // ✅ more compact
    height: 95,
    borderRadius: 18,

    paddingHorizontal: 14,
    paddingVertical: 12,
    marginRight: 10,

    justifyContent: 'space-between',

    backgroundColor: 'rgba(255,255,255,0.06)',   // ✨ Glass surface
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',       // Soft glass edge

    shadowColor: '#7c3aed',                     // 💜 Purple glow
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 10,

    backgroundColor: 'rgba(124,58,237,0.12)',    // Subtle purple tint
    justifyContent: 'center',
    alignItems: 'center',
  },

  count: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },

  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#a1a1aa',             // Soft gray cinematic text
  },
});
