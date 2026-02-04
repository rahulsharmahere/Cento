import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';

import ScreenLayout from '../components/ScreenLayout';
import AppHeader from '../components/AppHeader';
import HorizontalSection from '../components/HorizontalSection';
import SceneCard from '../components/SceneCard';
import StudioCard from '../components/StudioCard';
import PerformerCard from '../components/PerformerCard';

import { graphqlRequest } from '../services/graphql';
import { getServerConfig } from '../utils/storage';

import { GET_RECENT_SCENES } from '../graphql/scenes';
import { GET_RECENT_STUDIOS } from '../graphql/studios';
import { GET_RECENT_PERFORMERS } from '../graphql/performers';

const CARD_WIDTH = Math.round(Dimensions.get('window').width * 0.65);

export default function HomeScreen({ navigation }) {
  const [scenes, setScenes] = useState([]);
  const [studios, setStudios] = useState([]);
  const [performers, setPerformers] = useState([]);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const serverConfig = await getServerConfig();

      if (!serverConfig?.serverUrl || !serverConfig?.apiKey) {
        Alert.alert('Error', 'Server configuration missing');
        return;
      }

      setConfig(serverConfig);

      const scenesRes = await graphqlRequest(
        serverConfig.serverUrl,
        serverConfig.apiKey,
        GET_RECENT_SCENES()
      );

      const studiosRes = await graphqlRequest(
        serverConfig.serverUrl,
        serverConfig.apiKey,
        GET_RECENT_STUDIOS()
      );

      const performersRes = await graphqlRequest(
        serverConfig.serverUrl,
        serverConfig.apiKey,
        GET_RECENT_PERFORMERS()
      );

      setScenes(scenesRes.findScenes?.scenes || []);
      setStudios(studiosRes.findStudios?.studios || []);
      setPerformers(performersRes.findPerformers?.performers || []);
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to load dashboard');
    }
  };

  if (!config) return null;

  return (
    <ScreenLayout>
      <AppHeader title="Home" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <HorizontalSection
          title="Recently Added Scenes"
          data={scenes}
          renderItem={({ item }) => (
            <SceneCard
              scene={item}
              imageUrl={`${config.serverUrl}/scene/${item.id}/screenshot?apikey=${config.apiKey}`}
              style={{ width: CARD_WIDTH }}
              onPress={(id) =>
                navigation.navigate('SceneDetail', { sceneId: id })
              }
            />
          )}
          onViewAll={() => navigation.navigate('Scenes')}
        />

        <HorizontalSection
          title="Recently Added Studios"
          data={studios}
          renderItem={({ item }) => <StudioCard studio={item} />}
          onViewAll={() => navigation.navigate('Studios')}
        />

        <HorizontalSection
          title="Recently Added Performers"
          data={performers}
          renderItem={({ item }) => <PerformerCard performer={item} />}
          onViewAll={() => navigation.navigate('Performers')}
        />
      </ScrollView>
    </ScreenLayout>
  );
}
