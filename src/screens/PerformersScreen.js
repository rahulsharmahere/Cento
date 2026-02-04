import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';

import ScreenLayout from '../components/ScreenLayout';
import AppHeader from '../components/AppHeader';
import PerformerCard from '../components/PerformerCard';

import { graphqlRequest } from '../services/graphql';
import { getServerConfig } from '../utils/storage';
import { GET_PERFORMERS_PAGE } from '../graphql/performers';

export default function PerformersScreen() {
  const [performers, setPerformers] = useState([]);
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
        GET_PERFORMERS_PAGE(pageToLoad)
      );

      setPerformers(data.findPerformers.performers || []);
      setTotalCount(data.findPerformers.count || 0);
      setPage(pageToLoad);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.message || 'Failed to load performers');
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / 20);

  return (
    <ScreenLayout>
      <AppHeader title="Performers" showBack />

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} />
      ) : (
        <>
          <FlatList
  data={performers}
  keyExtractor={(item) => item.id}
  numColumns={2}
  columnWrapperStyle={styles.row}
  contentContainerStyle={styles.list}
  renderItem={({ item }) => (
    <PerformerCard performer={item} />
  )}
  ListFooterComponent={
    <View style={styles.pagination}>
      <TouchableOpacity
        style={[
          styles.button,
          page === 1 && styles.disabledButton,
        ]}
        disabled={page === 1}
        onPress={() => loadPage(page - 1)}
      >
        <Text style={styles.buttonText}>◀ Previous</Text>
      </TouchableOpacity>

      <Text style={styles.pageText}>
        Page {page} {totalPages ? `of ${totalPages}` : ''}
      </Text>

      <TouchableOpacity
        style={[
          styles.button,
          page >= totalPages && styles.disabledButton,
        ]}
        disabled={page >= totalPages}
        onPress={() => loadPage(page + 1)}
      >
        <Text style={styles.buttonText}>Next ▶</Text>
      </TouchableOpacity>
    </View>
  }
/>

        </>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  row: {
    justifyContent: 'space-between',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#000',
    borderRadius: 6,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
  },
  pageText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
