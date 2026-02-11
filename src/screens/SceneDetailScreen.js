import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Video from 'react-native-video';

import ScreenLayout from '../components/ScreenLayout';
import AppHeader from '../components/AppHeader';
import { graphqlRequest } from '../services/graphql';
import { getServerConfig } from '../utils/storage';
import { GET_SCENE_DETAILS } from '../graphql/scenes';

export default function SceneDetailScreen({ route }) {
  const { sceneId } = route.params;

  const [scene, setScene] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);

  useEffect(() => {
    loadScene();
  }, []);

  const loadScene = async () => {
    const { serverUrl, apiKey } = await getServerConfig();

    const data = await graphqlRequest(
      serverUrl,
      apiKey,
      GET_SCENE_DETAILS(sceneId)
    );

    setScene(data.findScene);
    setVideoUrl(`${serverUrl}/scene/${sceneId}/stream?apikey=${apiKey}`);
  };

  if (!scene || !videoUrl) {
    return (
      <ScreenLayout>
        <AppHeader title="Scene" showBack />
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#7c3aed" />
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <AppHeader title="Scene" showBack />

      {/* 🎬 Video Player */}
      <View style={styles.videoContainer}>
        <Video
          source={{ uri: videoUrl }}
          style={styles.video}
          controls
          resizeMode="contain"
        />
      </View>

      {/* 🎬 Details */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{scene.title}</Text>

        <View style={styles.metaContainer}>
          {scene.studio && (
            <Text style={styles.meta}>
              {scene.studio.name}
            </Text>
          )}

          {scene.date && (
            <Text style={styles.metaSecondary}>
              {scene.date}
            </Text>
          )}
        </View>

        {scene.details && (
          <View style={styles.glassCard}>
            <Text style={styles.description}>
              {scene.details}
            </Text>
          </View>
        )}

        {/* 🔥 Tags */}
        {scene.tags?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tags</Text>

            <View style={styles.tags}>
              {scene.tags.map(tag => (
                <View key={tag.id} style={styles.tag}>
                  <Text style={styles.tagText}>
                    {tag.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 🔥 Performers */}
        {scene.performers?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Performers</Text>

            {scene.performers.map(p => (
              <Text key={p.id} style={styles.performer}>
                {p.name}
              </Text>
            ))}
          </View>
        )}

      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({

  videoContainer: {
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },

  video: {
    width: '100%',
    height: 240,
    backgroundColor: '#000',
  },

  content: {
    paddingHorizontal: 14,
    paddingTop: 14,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',

    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowRadius: 6,
  },

  metaContainer: {
    marginTop: 6,
    marginBottom: 12,
  },

  meta: {
    fontSize: 13,
    fontWeight: '500',
    color: '#a1a1aa',
  },

  metaSecondary: {
    fontSize: 12,
    color: '#71717a',
    marginTop: 2,
  },

  glassCard: {
    marginTop: 6,
    padding: 12,
    borderRadius: 14,

    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },

  description: {
    fontSize: 13,
    lineHeight: 20,
    color: '#e4e4e7',
  },

  section: {
    marginTop: 18,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 10,
  },

  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  tag: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  tagText: {
    fontSize: 11,
    color: '#e4e4e7',
  },

  performer: {
    fontSize: 13,
    color: '#d4d4d8',
    marginBottom: 6,
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
