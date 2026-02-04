import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { getServerConfig } from '../utils/storage';

export default function PerformerCard({ performer }) {
  const [config, setConfig] = React.useState(null);

  React.useEffect(() => {
    getServerConfig().then(setConfig);
  }, []);

  if (!config) return null;

  const imageUrl = `${config.serverUrl}/performer/${performer.id}/image?apikey=${config.apiKey}`;

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text numberOfLines={1} style={styles.name}>
        {performer.name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 120,
    marginRight: 12,
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 160,
    borderRadius: 10,
    backgroundColor: '#ccc',
  },
  name: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
});
