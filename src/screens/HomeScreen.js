import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  Alert,
  Dimensions,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
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
import { GET_TAGS_PAGE } from '../graphql/tags';   // ✅ ADD

const CARD_WIDTH = Math.round(Dimensions.get('window').width * 0.65);

export default function HomeScreen({ navigation }) {
  const [scenes, setScenes] = useState([]);
  const [studios, setStudios] = useState([]);
  const [performers, setPerformers] = useState([]);
  const [tags, setTags] = useState([]);          // ✅ ADD
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

      const tagsRes = await graphqlRequest(        // ✅ ADD
        serverConfig.serverUrl,
        serverConfig.apiKey,
        GET_TAGS_PAGE(1, 25)
      );

      setScenes(scenesRes.findScenes?.scenes || []);
      setStudios(studiosRes.findStudios?.studios || []);
      setPerformers(performersRes.findPerformers?.performers || []);
      setTags(tagsRes.findTags?.tags || []);       // ✅ ADD

    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to load dashboard');
    }
  };

  if (!config) return null;

  return (
    <ScreenLayout>
      <AppHeader title="Home" />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ✅ Scenes */}
        <HorizontalSection
          title="Recently Added Scenes"
          data={scenes}
          renderItem={({ item }) => (
            <View style={styles.sceneWrapper}>   {/* ✅ SPACING FIX */}
              <SceneCard
                scene={item}
                imageUrl={`${config.serverUrl}/scene/${item.id}/screenshot?apikey=${config.apiKey}`}
                style={{ width: CARD_WIDTH }}
                onPress={(id) =>
                  navigation.navigate('SceneDetail', { sceneId: id })
                }
              />
            </View>
          )}
          onViewAll={() => navigation.navigate('Scenes')}
        />

        {/* ✅ Studios */}
        <HorizontalSection
          title="Recently Added Studios"
          data={studios}
          renderItem={({ item }) => (
            <StudioCard studio={item} />
          )}
          onViewAll={() => navigation.navigate('Studios')}
        />

        {/* ✅ Performers (NOW CLICKABLE) */}
        <HorizontalSection
          title="Recently Added Performers"
          data={performers}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate('Performer', { performer: item })
              }
            >
              <PerformerCard performer={item} />
            </TouchableOpacity>
          )}
          onViewAll={() => navigation.navigate('Performers')}
        />

        {/* ✅ Tags Section */}
        <View style={styles.tagsSection}>

          <View style={styles.tagsHeader}>
            <Text style={styles.sectionTitle}>Tags</Text>

            <TouchableOpacity onPress={() => navigation.navigate('Tags')}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tagsContainer}>
            {tags.map(tag => (
              <TouchableOpacity
                key={tag.id}
                style={styles.tagPill}
                onPress={() =>
                  navigation.navigate('TagDetail', { tag })
                }
              >
                <Text style={styles.tagText}>{tag.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

        </View>

      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({

  sceneWrapper: {
    marginRight: 12,    // ✅ SCENE SPACING FIX
  },

  tagsSection: {
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 30,
  },

  tagsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },

  viewAll: {
    fontSize: 13,
    fontWeight: '500',
    color: '#2563eb',
  },

  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  tagPill: {
    backgroundColor: '#eee',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },

  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
