import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  FlatList,
  Text,
 TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';

import ScreenLayout from '../components/ScreenLayout';
import AppHeader from '../components/AppHeader';
import PerformerCard from '../components/PerformerCard';

import { graphqlRequest } from '../services/graphql';
import { getServerConfig } from '../utils/storage';
import { GET_PERFORMERS_PAGE } from '../graphql/performers';

export default function PerformersScreen({ navigation }) {
  const [performers, setPerformers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

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

  // 🔍 Performer search (fast & memoized)
  const filteredPerformers = useMemo(() => {
    if (!search.trim()) return performers;

    const q = search.toLowerCase();

    return performers.filter(p =>
      p.name.toLowerCase().includes(q)
    );
  }, [search, performers]);

  const renderPerformer = ({ item }) => (
    <TouchableOpacity
      style={styles.cardWrapper}
      activeOpacity={0.85}
      onPress={() =>
        navigation.navigate('Performer', { performer: item })
      }
    >
      <PerformerCard performer={item} />
    </TouchableOpacity>
  );

  return (
    <ScreenLayout>
      <AppHeader title="Performers" showBack />

      {/* ✅ Search Bar */}
      <TextInput
        style={styles.search}
        placeholder="Search performers..."
        placeholderTextColor="#94a3b8"
        value={search}
        onChangeText={setSearch}
      />

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filteredPerformers}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.list}
          renderItem={renderPerformer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.empty}>No performers found</Text>
          }
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
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 10,   // ✅ Symmetric margins
    paddingTop: 12,
    paddingBottom: 30,
  },

  // ✅ PERFECTLY EVEN GRID
  cardWrapper: {
    flex: 1,
    marginHorizontal: 6,     // ✅ Equal gutters
    marginBottom: 14,
  },

  /* Search */
  search: {
    marginHorizontal: 12,
    marginTop: 10,
    marginBottom: 6,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#fff',
  },

  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  button: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    backgroundColor: '#0f172a',
    borderRadius: 8,
  },

  disabledButton: {
    backgroundColor: '#cbd5f5',
  },

  buttonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },

  pageText: {
    fontSize: 13,
    fontWeight: '600',
  },

  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#94a3b8',
  },
});
