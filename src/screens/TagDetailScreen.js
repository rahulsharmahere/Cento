import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
  TextInput,
  Alert,
} from 'react-native';

import ScreenLayout from '../components/ScreenLayout';
import AppHeader from '../components/AppHeader';

import { graphqlRequest } from '../services/graphql';
import { getServerConfig } from '../utils/storage';
import { GET_TAG_SCENES } from '../graphql/tagDetails';

export default function TagDetailScreen({ route, navigation }) {
  const { tag } = route.params;

  const [details, setDetails] = useState(null);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadTag();
  }, []);

  const loadTag = async () => {
    try {
      const serverConfig = await getServerConfig();
      setConfig(serverConfig);

      const data = await graphqlRequest(
        serverConfig.serverUrl,
        serverConfig.apiKey,
        GET_TAG_SCENES(tag.id)
      );

      console.log('🔥 TAG SCENES:', data);

      setDetails({
        name: tag.name,
        scenes: data.findScenes?.scenes || [],
      });

    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to load tag');
    } finally {
      setLoading(false);
    }
  };

  const filteredScenes = useMemo(() => {
    if (!details?.scenes) return [];

    if (!search.trim()) return details.scenes;

    const q = search.toLowerCase();

    return details.scenes.filter(scene =>
      scene.title.toLowerCase().includes(q) ||
      scene.studio?.name?.toLowerCase().includes(q)
    );
  }, [search, details]);

  if (loading || !config) {
    return (
      <ScreenLayout>
        <AppHeader title={tag.name} showBack />
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#7c3aed" />
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <AppHeader title={details.name} showBack />

      {/* 🔥 SEARCH BAR */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search scenes..."
          placeholderTextColor="#71717a"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filteredScenes}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}

        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.sceneCard}
            activeOpacity={0.85}
            onPress={() =>
              navigation.navigate('SceneDetail', { sceneId: item.id })
            }
          >
            {/* ✅ RELIABLE SCREENSHOT */}
            <Image
              source={{
                uri: `${config.serverUrl}/scene/${item.id}/screenshot?apikey=${config.apiKey}`,
              }}
              style={styles.thumb}
            />

            <View style={styles.sceneInfo}>
              <Text style={styles.title} numberOfLines={2}>
                {item.title}
              </Text>

              <Text style={styles.studio}>
                {item.studio?.name || 'Unknown Studio'}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        ListEmptyComponent={
          <View style={styles.loader}>
            <Text style={styles.empty}>
              No scenes found 😌
            </Text>
          </View>
        }
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 12,
    paddingBottom: 30,
  },

  searchContainer: {
    paddingHorizontal: 12,
    marginBottom: 10,
  },

  searchInput: {
    height: 42,
    borderRadius: 12,

    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',

    paddingHorizontal: 14,
    color: '#ffffff',
  },

  sceneCard: {
    flexDirection: 'row',
    marginBottom: 12,

    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 14,
    overflow: 'hidden',

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },

  thumb: {
    width: 120,
    height: 80,
    backgroundColor: '#222',
  },

  sceneInfo: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },

  title: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },

  studio: {
    fontSize: 11,
    color: '#a1a1aa',
    marginTop: 4,
  },

  empty: {
    color: '#71717a',
    fontSize: 14,
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
