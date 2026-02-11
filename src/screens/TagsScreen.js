import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';

import ScreenLayout from '../components/ScreenLayout';
import AppHeader from '../components/AppHeader';

import { graphqlRequest } from '../services/graphql';
import { getServerConfig } from '../utils/storage';
import { GET_TAGS_PAGE } from '../graphql/tags';

const PAGE_SIZE = 50;

export default function TagsScreen({ navigation }) {
  const [allTags, setAllTags] = useState([]);   // ✅ CACHE
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      setLoading(true);

      const { serverUrl, apiKey } = await getServerConfig();

      // ✅ Fetch MULTIPLE pages automatically
      let pageToLoad = 1;
      let fetched = [];
      let hasMore = true;

      while (hasMore) {
        const data = await graphqlRequest(
          serverUrl,
          apiKey,
          GET_TAGS_PAGE(pageToLoad)
        );

        const tags = data.findTags?.tags || [];

        fetched = [...fetched, ...tags];

        if (tags.length < PAGE_SIZE) {
          hasMore = false;
        } else {
          pageToLoad++;
        }
      }

      fetched.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      setAllTags(fetched);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to load tags');
    } finally {
      setLoading(false);
    }
  };

  // ✅ GLOBAL SEARCH ACROSS CACHE
  const filteredTags = useMemo(() => {
    if (!search.trim()) return allTags;

    const q = search.toLowerCase();

    return allTags.filter(tag =>
      tag.name.toLowerCase().includes(q)
    );
  }, [search, allTags]);

  const totalPages = Math.ceil(filteredTags.length / PAGE_SIZE);

  const paginatedTags = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredTags.slice(start, start + PAGE_SIZE);
  }, [filteredTags, page]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScreenLayout>
      <AppHeader title="Tags" />

      {/* ✅ Search */}
      <TextInput
        style={styles.search}
        placeholder="Search tags..."
        placeholderTextColor="#94a3b8"
        value={search}
        onChangeText={(text) => {
          setSearch(text);
          setPage(1); // ✅ RESET PAGE
        }}
      />

      {/* ✅ Tags */}
      <FlatList
        data={paginatedTags}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.tagRow}
            onPress={() =>
              navigation.navigate('TagDetail', { tag: item })
            }
          >
            <Text style={styles.tagName}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* ✅ Pagination */}
      {totalPages > 1 && (
        <View style={styles.pagination}>
          <TouchableOpacity
            style={[
              styles.pageButton,
              page === 1 && styles.disabledButton,
            ]}
            disabled={page === 1}
            onPress={() => setPage(page - 1)}
          >
            <Text style={styles.pageText}>◀ Prev</Text>
          </TouchableOpacity>

          <Text style={styles.pageIndicator}>
            Page {page} / {totalPages}
          </Text>

          <TouchableOpacity
            style={[
              styles.pageButton,
              page >= totalPages && styles.disabledButton,
            ]}
            disabled={page >= totalPages}
            onPress={() => setPage(page + 1)}
          >
            <Text style={styles.pageText}>Next ▶</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },

  tagRow: {
    backgroundColor: '#1e293b',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },

  tagName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },

  search: {
    margin: 12,
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#1e293b',
  },

  pageButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#1e293b',
    borderRadius: 8,
  },

  disabledButton: {
    backgroundColor: '#94a3b8',
  },

  pageText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },

  pageIndicator: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
