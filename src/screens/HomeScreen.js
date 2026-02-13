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
import StatsCard from '../components/StatsCard';

import { graphqlRequest } from '../services/graphql';
import { getServerConfig } from '../utils/storage';

import { GET_RECENT_SCENES } from '../graphql/scenes';
import { GET_RECENT_STUDIOS } from '../graphql/studios';
import { GET_RECENT_PERFORMERS } from '../graphql/performers';
import { GET_TAGS_PAGE } from '../graphql/tags';
import { GET_STATS } from '../graphql/stats';

const CARD_WIDTH = Math.round(Dimensions.get('window').width * 0.65);

export default function HomeScreen({ navigation }) {
  const [scenes, setScenes] = useState([]);
  const [studios, setStudios] = useState([]);
  const [performers, setPerformers] = useState([]);
  const [tags, setTags] = useState([]);
  const [stats, setStats] = useState(null);
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

      const statsRes = await graphqlRequest(
        serverConfig.serverUrl,
        serverConfig.apiKey,
        GET_STATS
      );

      setStats(statsRes);

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

      const tagsRes = await graphqlRequest(
        serverConfig.serverUrl,
        serverConfig.apiKey,
        GET_TAGS_PAGE(1, '')
      );

      setScenes(scenesRes.findScenes?.scenes || []);
      setStudios(studiosRes.findStudios?.studios || []);
      setPerformers(performersRes.findPerformers?.performers || []);
      setTags(tagsRes.findTags?.tags?.slice(0, 25) || []);

    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to load dashboard');
    }
  };

  if (!config) return null;

  return (
    <ScreenLayout>
      <AppHeader title="Home" />

      <ScrollView showsVerticalScrollIndicator={false}>

        {stats && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statsRow}
          >
            <StatsCard
              label="Studios"
              count={stats.findStudios?.count || 0}
              icon="business"
            />

            <StatsCard
              label="Performers"
              count={stats.findPerformers?.count || 0}
              icon="people"
            />

            <StatsCard
              label="Scenes"
              count={stats.findScenes?.count || 0}
              icon="movie"
            />

            <StatsCard
              label="Tags"
              count={stats.findTags?.count || 0}
              icon="local-offer"
            />
          </ScrollView>
        )}

        <HorizontalSection
          title="Recently Added Scenes"
          data={scenes}
          renderItem={({ item }) => (
            <View style={styles.sceneWrapper}>
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

        <HorizontalSection
          title="Recently Added Studios"
          data={studios}
          renderItem={({ item }) => (
            <StudioCard studio={item} />
          )}
          onViewAll={() => navigation.navigate('Studios')}
        />

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

  statsRow: {
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 12,
  },

  sceneWrapper: {
    marginRight: 14,
  },

  tagsSection: {
    paddingHorizontal: 12,
    marginTop: 20,
    marginBottom: 40,
  },

  tagsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 2,  
    textShadowColor: 'rgba(0,0,0,0.6)',   // ✅ cinematic clarity trick
    textShadowRadius: 6,
  },

  viewAll: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7c3aed',
  },

  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  tagPill: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 10,

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  tagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#e4e4e7',
  },
  
});
