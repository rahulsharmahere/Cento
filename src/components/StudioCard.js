import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { getServerConfig } from '../utils/storage';

export default function StudioCard({ studio }) {
  const [config, setConfig] = React.useState(null);

  React.useEffect(() => {
    getServerConfig().then(setConfig);
  }, []);

  if (!config) return null;

  const imageUrl = `${config.serverUrl}/studio/${studio.id}/image?apikey=${config.apiKey}`;

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text numberOfLines={1} style={styles.title}>
        {studio.name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: 140,
    borderRadius: 8,
    backgroundColor: '#ccc',
  },
  title: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
});
