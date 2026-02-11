import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Alert,
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
 TextInput,
} from 'react-native';

import ScreenLayout from '../components/ScreenLayout';
import AppHeader from '../components/AppHeader';
import SceneCard from '../components/SceneCard';

import { graphqlRequest } from '../services/graphql';
import { getServerConfig } from '../utils/storage';
import { GET_SCENES_PAGE } from '../graphql/scenes';

const PER_PAGE = 20;

export default function ScenesScreen({ navigation }) {
  const [scenes, setScenes] = useState([]);
  const [config, setConfig] = useState(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const totalPages = Math.ceil(totalCount / PER_PAGE);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const serverConfig = await getServerConfig();

      if (!serverConfig?.serverUrl || !serverConfig?.apiKey) {
        Alert.alert('Error', 'Server configuration missing');
        return;
      }

      setConfig(serverConfig);
      loadScenes(1, serverConfig, '');

    } catch (err) {
      console.log('🔥 INIT ERROR:', err);
    }
  };

  const loadScenes = async (
    pageToLoad,
    serverConfig = config,
    searchQuery = search
  ) => {
    if (loading || !serverConfig) return;

    try {
      setLoading(true);

      console.log('🔥 Loading Page:', pageToLoad, 'Search:', searchQuery);

      const res = await graphqlRequest(
        serverConfig.serverUrl,
        serverConfig.apiKey,
        GET_SCENES_PAGE(pageToLoad, searchQuery)
      );

      const newScenes = res?.findScenes?.scenes || [];
      const count = res?.findScenes?.count || 0;

      console.log('🔥 Scenes:', newScenes.length);
      console.log('🔥 Total Count:', count);

      setScenes(newScenes);
      setTotalCount(count);
      setPage(pageToLoad);

    } catch (err) {
      console.log('🔥 LOAD ERROR:', err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ SEARCH HANDLER
  const handleSearch = (text) => {
    setSearch(text);
    loadScenes(1, config, text);   // ✅ Reset to page 1
  };

  if (!config) {
    return (
      <ScreenLayout>
        <AppHeader title="Scenes" />
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#7c3aed" />
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <AppHeader title="Scenes" />

      {/* 🔥 SEARCH BAR */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search scenes..."
          placeholderTextColor="#71717a"
          style={styles.searchInput}
          value={search}
          onChangeText={handleSearch}
        />
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#7c3aed" />
        </View>
      ) : (
        <FlatList
          data={scenes}
          numColumns={2}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}

          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}

          ListEmptyComponent={
            <View style={styles.loader}>
              <Text style={styles.emptyText}>
                No scenes found 😌
              </Text>
            </View>
          }

          renderItem={({ item }) => (
            <SceneCard
              scene={item}
              imageUrl={`${config.serverUrl}/scene/${item.id}/screenshot?apikey=${config.apiKey}`}
              onPress={(id) =>
                navigation.navigate('SceneDetail', { sceneId: id })
              }
            />
          )}
        />
      )}

      {/* 🎬 PAGINATION CONTROLS */}
      <View style={styles.pagination}>

        <TouchableOpacity
          onPress={() => loadScenes(1)}
          disabled={page === 1}
          style={[styles.button, page === 1 && styles.disabled]}
        >
          <Text style={styles.buttonText}>First</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => loadScenes(page - 1)}
          disabled={page === 1}
          style={[styles.button, page === 1 && styles.disabled]}
        >
          <Text style={styles.buttonText}>Prev</Text>
        </TouchableOpacity>

        <Text style={styles.pageText}>
          {page} / {totalPages || 1}
        </Text>

        <TouchableOpacity
          onPress={() => loadScenes(page + 1)}
          disabled={page === totalPages}
          style={[styles.button, page === totalPages && styles.disabled]}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => loadScenes(totalPages)}
          disabled={page === totalPages}
          style={[styles.button, page === totalPages && styles.disabled]}
        >
          <Text style={styles.buttonText}>Last</Text>
        </TouchableOpacity>

      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 12,
    marginBottom: 8,
  },

  searchInput: {
    height: 42,
    borderRadius: 12,

    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',

    paddingHorizontal: 14,
    color: '#ffffff',
    fontSize: 14,
  },

  row: {
    paddingHorizontal: 12,
    gap: 10,
    marginBottom: 10,
  },

  listContent: {
    paddingTop: 4,
    paddingBottom: 80,
  },

  pagination: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    backgroundColor: 'rgba(20,20,30,0.95)',
    padding: 10,
    borderRadius: 14,

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },

  button: {
    paddingHorizontal: 10,
  },

  buttonText: {
    color: '#7c3aed',
    fontSize: 13,
    fontWeight: '600',
  },

  disabled: {
    opacity: 0.35,
  },

  pageText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    color: '#a1a1aa',
    fontSize: 14,
  },
});
