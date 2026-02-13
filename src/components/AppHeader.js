import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function AppHeader() {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        {navigation.canGoBack() ? (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Text style={styles.back}>←</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}

        <Text style={styles.title}>
          {route.name}
        </Text>

        <View style={styles.placeholder} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  /* 🔥 Outer wrapper → Glass + Shadow */
  wrapper: {
    backgroundColor: 'rgba(255,255,255,0.04)',  // ✨ Glass tone
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,

    elevation: 10,  // ✅ Android depth
  },

  /* 🔥 Inner layout */
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },

  backButton: {
    width: 32,
    alignItems: 'flex-start',
  },

  back: {
    fontSize: 22,
    color: '#ffffff',

    textShadowColor: 'rgba(0,0,0,0.6)',   // ✨ Premium clarity
    textShadowRadius: 6,
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',

    textShadowColor: 'rgba(0,0,0,0.6)',   // 🔥 Cinematic readability
    textShadowRadius: 8,
  },

  placeholder: {
    width: 32,
  },
});
