import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

import { graphqlRequest } from '../services/graphql';
import { saveServerConfig } from '../utils/storage';
import Footer from '../components/Footer';

export default function LoginScreen({ navigation }) {
  const [serverUrl, setServerUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);

  const pasteApiKey = async () => {
    const text = await Clipboard.getString();
    if (text) {
      setApiKey(text.trim());
    } else {
      Alert.alert('Clipboard empty');
    }
  };

  const testAndLogin = async () => {
    if (!serverUrl || !apiKey) {
      Alert.alert('Error', 'Please enter Server URL and API Key');
      return;
    }

    setLoading(true);

    try {
      await graphqlRequest(
        serverUrl,
        apiKey,
        `{ version { version } }`
      );

      await saveServerConfig(serverUrl, apiKey);
      navigation.replace('Main');
    } catch (err) {
      Alert.alert('Connection Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Connect to Stash</Text>

        {/* ✅ URL INPUT – visible again */}
        <TextInput
          placeholder="http://192.168.1.10:9999"
          value={serverUrl}
          onChangeText={setServerUrl}
          autoCapitalize="none"
          style={styles.input}
        />

        {/* 🔑 API Key + Paste */}
        <View style={styles.apiRow}>
          <TextInput
            placeholder="API Key"
            value={apiKey}
            onChangeText={setApiKey}
            autoCapitalize="none"
            secureTextEntry
            style={[styles.input, styles.apiInput]}
          />

          <TouchableOpacity style={styles.pasteBtn} onPress={pasteApiKey}>
            <Text style={styles.pasteText}>Paste</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={testAndLogin}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Connect</Text>
          )}
        </TouchableOpacity>
      </View>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  apiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  apiInput: {
    flex: 1,        // ✅ ONLY here
    marginBottom: 0,
  },
  pasteBtn: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  pasteText: {
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
