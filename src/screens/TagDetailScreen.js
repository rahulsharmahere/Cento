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
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadTag();
  }, []);

  const loadTag = async () => {
  try {
    const { serverUrl, apiKey } = await getServerConfig();

    const data = await graphqlRequest(
      serverUrl,
      apiKey,
      GET_TAG_SCENES(tag.id)
    );

    console.log("TAG SCENES:", data);

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

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!details) {
    return (
      <View style={styles.loader}>
        <Text>Failed to load tag</Text>
      </View>
    );
  }

  return (
    <ScreenLayout>
      <AppHeader title={details.name} showBack />

      <TextInput
        style={styles.search}
        placeholder="Search scenes..."
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredScenes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.sceneCard}
            onPress={() =>
              navigation.navigate('SceneDetail', { sceneId: item.id })
            }
          >
            <Image
              source={{ uri: item.paths?.screenshot }}
              style={styles.thumb}
            />

            <View style={styles.sceneInfo}>
              <Text style={styles.title} numberOfLines={2}>
                {item.title}
              </Text>

              <Text style={styles.studio}>
                {item.studio?.name}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No scenes found</Text>
        }
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  search: {
    margin: 12,
    backgroundColor: '#eee',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  sceneCard: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },

  thumb: {
    width: 110,
    height: 70,
    borderRadius: 6,
  },

  sceneInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },

  title: {
    fontSize: 14,
    fontWeight: '500',
  },

  studio: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },

  empty: {
    textAlign: 'center',
    marginTop: 40,
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
