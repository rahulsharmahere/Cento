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
      <View style={styles.loader}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScreenLayout>
      <AppHeader title="Scene" showBack />

      {/* Video Player */}
      <Video
        source={{ uri: videoUrl }}
        style={styles.video}
        controls
        resizeMode="contain"
      />

      {/* Details */}
      <ScrollView style={styles.content}>
        <Text style={styles.title}>{scene.title}</Text>

        {scene.studio && (
          <Text style={styles.meta}>Studio: {scene.studio.name}</Text>
        )}

        {scene.date && (
          <Text style={styles.meta}>Date: {scene.date}</Text>
        )}

        {scene.details && (
          <Text style={styles.description}>{scene.details}</Text>
        )}

        {/* Tags */}
        {scene.tags?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tags}>
              {scene.tags.map(tag => (
                <View key={tag.id} style={styles.tag}>
                  <Text style={styles.tagText}>{tag.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Performers */}
        {scene.performers?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Performers</Text>
            {scene.performers.map(p => (
              <Text key={p.id} style={styles.performer}>
                • {p.name}
              </Text>
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  video: {
    width: '100%',
    height: 240,
    backgroundColor: '#000',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  meta: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  description: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 6,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#eee',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 12,
  },
  performer: {
    fontSize: 14,
    marginBottom: 4,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
