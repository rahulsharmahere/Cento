import React, { useEffect, useState } from 'react';
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';

import ScreenLayout from '../components/ScreenLayout';
import AppHeader from '../components/AppHeader';
import StudioCard from '../components/StudioCard';

import { graphqlRequest } from '../services/graphql';
import { getServerConfig } from '../utils/storage';
import { GET_STUDIOS_PAGE } from '../graphql/studios';

export default function StudiosScreen() {
  const [studios, setStudios] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPage(1);
  }, []);

  const loadPage = async (pageToLoad) => {
    try {
      setLoading(true);
      const { serverUrl, apiKey } = await getServerConfig();

      const data = await graphqlRequest(
        serverUrl,
        apiKey,
        GET_STUDIOS_PAGE(pageToLoad)
      );

      setStudios(data.findStudios.studios || []);
      setTotalCount(data.findStudios.count || 0);
      setPage(pageToLoad);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / 20);

  return (
    <ScreenLayout>
      <AppHeader title="Studios" />

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={studios}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <StudioCard studio={item} />
          )}
          ListFooterComponent={
            <View style={styles.pagination}>
              <TouchableOpacity
                disabled={page === 1}
                style={[styles.btn, page === 1 && styles.disabled]}
                onPress={() => loadPage(page - 1)}
              >
                <Text style={styles.btnText}>◀ Previous</Text>
              </TouchableOpacity>

              <Text style={styles.pageText}>
                Page {page} of {totalPages || 1}
              </Text>

              <TouchableOpacity
                disabled={page >= totalPages}
                style={[styles.btn, page >= totalPages && styles.disabled]}
                onPress={() => loadPage(page + 1)}
              >
                <Text style={styles.btnText}>Next ▶</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: 12, paddingTop: 10 },
  row: { justifyContent: 'space-between' },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  btn: {
    backgroundColor: '#000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  disabled: { backgroundColor: '#ccc' },
  btnText: { color: '#fff', fontSize: 13 },
  pageText: { fontSize: 13, fontWeight: '500' },
});
