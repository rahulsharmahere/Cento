import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Alert,
} from 'react-native';

import ScreenLayout from '../components/ScreenLayout';
import AppHeader from '../components/AppHeader';
import SceneCard from '../components/SceneCard';

import { graphqlRequest } from '../services/graphql';
import { getServerConfig } from '../utils/storage';
import { GET_SCENES_PAGE } from '../graphql/scenes';

export default function SceneScreen({ navigation }) {
  const [scenes, setScenes] = useState([]);
  const [config, setConfig] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadScenes(1);
  }, []);

  const loadScenes = async (pageToLoad) => {
    if (loading) return;

    try {
      setLoading(true);

      const serverConfig = await getServerConfig();

      if (!serverConfig?.serverUrl || !serverConfig?.apiKey) {
        Alert.alert('Error', 'Server configuration missing');
        return;
      }

      setConfig(serverConfig);

      const res = await graphqlRequest(
        serverConfig.serverUrl,
        serverConfig.apiKey,
        GET_SCENES_PAGE(pageToLoad)
      );

      const newScenes = res.findScenes?.scenes || [];

      setScenes(prev =>
        pageToLoad === 1 ? newScenes : [...prev, ...newScenes]
      );

      setPage(pageToLoad);
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to load scenes');
    } finally {
      setLoading(false);
    }
  };

  if (!config) return null;

  return (
    <ScreenLayout>
      <AppHeader title="Scenes" />

      <FlatList
        data={scenes}
        numColumns={2}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{
          paddingHorizontal: 16,
          gap: 12,
        }}
        contentContainerStyle={{
          paddingTop: 12,
          paddingBottom: 24,
        }}
        onEndReached={() => loadScenes(page + 1)}
        onEndReachedThreshold={0.6}
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
    </ScreenLayout>
  );
}
