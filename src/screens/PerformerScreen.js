import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';

import { graphqlRequest } from '../services/graphql';
import { getServerConfig } from '../utils/storage';
import { GET_PERFORMER_DETAILS } from '../graphql/performerDetails';

export default function PerformerScreen({ route, navigation }) {
  const { performer } = route.params;

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadPerformer();
  }, []);

  const loadPerformer = async () => {
    try {
      const { serverUrl, apiKey } = await getServerConfig();

      const data = await graphqlRequest(
        serverUrl,
        apiKey,
        GET_PERFORMER_DETAILS(performer.id)
      );

      setDetails(data.findPerformer);
    } catch (err) {
      Alert.alert('Error', 'Failed to load performer');
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
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!details) {
    return (
      <View style={styles.loader}>
        <Text style={{ color: '#fff' }}>Failed to load performer</Text>
      </View>
    );
  }

  const performerImage = details.images?.[0]?.url;

  return (
    <View style={styles.container}>

      {/* ✅ Header */}
      <View style={styles.header}>

        {/* ✅ Safe Image / Placeholder */}
        {performerImage ? (
          <Image
            source={{ uri: performerImage }}
            style={styles.image}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>
              {details.name?.charAt(0)}
            </Text>
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.name}>{details.name}</Text>
          <Text style={styles.meta}>Gender: {details.gender}</Text>
          <Text style={styles.meta}>Birthdate: {details.birthdate}</Text>
          <Text style={styles.meta}>
            Scenes: {details.scenes?.length || 0}
          </Text>
        </View>
      </View>

      {/* ✅ Search */}
      <TextInput
        style={styles.search}
        placeholder="Search scenes or studios..."
        placeholderTextColor="#94a3b8"
        value={search}
        onChangeText={setSearch}
      />

      {/* ✅ Scenes */}
      <FlatList
        data={filteredScenes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.sceneCard}
            activeOpacity={0.85}
            onPress={() =>
              navigation.navigate('SceneDetail', { sceneId: item.id })
            }
          >
            <Image
              source={{ uri: item.paths?.screenshot }}
              style={styles.thumbnail}
            />

            <View style={styles.sceneInfo}>
              <Text style={styles.sceneTitle} numberOfLines={2}>
                {item.title}
              </Text>

              <Text style={styles.sceneStudio}>
                {item.studio?.name}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No scenes found</Text>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#0f172a',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    flexDirection: 'row',
    marginBottom: 20,
  },

  image: {
    width: 110,
    height: 110,
    borderRadius: 12,
    backgroundColor: '#1e293b',
  },

  imagePlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 12,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
  },

  placeholderText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#94a3b8',
  },

  info: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },

  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
  },

  meta: {
    fontSize: 14,
    color: '#cbd5f5',
    marginBottom: 2,
  },

  search: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#fff',
    marginBottom: 16,
  },

  sceneCard: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
  },

  thumbnail: {
    width: 110,
    height: 80,
    backgroundColor: '#0f172a',
  },

  sceneInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },

  sceneTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },

  sceneStudio: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },

  empty: {
    textAlign: 'center',
    color: '#94a3b8',
    marginTop: 40,
  },
});
