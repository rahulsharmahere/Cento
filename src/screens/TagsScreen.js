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
  const [allTags, setAllTags] = useState([]);
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
        b.scene_count - a.scene_count   // ✅ Sort by popularity 😏🔥
      );

      setAllTags(fetched);

    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to load tags');
    } finally {
      setLoading(false);
    }
  };

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
      <ScreenLayout>
        <AppHeader title="Tags" />
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#7c3aed" />
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <AppHeader title="Tags" />

      {/* 🔥 SEARCH */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search tags..."
          placeholderTextColor="#71717a"
          style={styles.searchInput}
          value={search}
          onChangeText={(text) => {
            setSearch(text);
            setPage(1);
          }}
        />
      </View>

      {/* 🎬 TAGS */}
      <FlatList
        data={paginatedTags}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}

        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.tagCard}
            activeOpacity={0.85}
            onPress={() =>
              navigation.navigate('TagDetail', { tag: item })
            }
          >
            {/* COUNT BADGE */}
            <View style={styles.countBadge}>
              <Text style={styles.countText}>
                {item.scene_count || 0}
              </Text>
            </View>

            {/* TAG NAME */}
            <View style={styles.tagLabel}>
              <Text style={styles.tagText}>
                {item.name}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* 🎬 PAGINATION */}
      {totalPages > 1 && (
        <View style={styles.pagination}>

          <TouchableOpacity
            onPress={() => setPage(1)}
            disabled={page === 1}
            style={[styles.pageButton, page === 1 && styles.disabled]}
          >
            <Text style={styles.pageButtonText}>First</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setPage(page - 1)}
            disabled={page === 1}
            style={[styles.pageButton, page === 1 && styles.disabled]}
          >
            <Text style={styles.pageButtonText}>Prev</Text>
          </TouchableOpacity>

          <Text style={styles.pageIndicator}>
            {page} / {totalPages}
          </Text>

          <TouchableOpacity
            onPress={() => setPage(page + 1)}
            disabled={page === totalPages}
            style={[styles.pageButton, page === totalPages && styles.disabled]}
          >
            <Text style={styles.pageButtonText}>Next</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setPage(totalPages)}
            disabled={page === totalPages}
            style={[styles.pageButton, page === totalPages && styles.disabled]}
          >
            <Text style={styles.pageButtonText}>Last</Text>
          </TouchableOpacity>

        </View>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 12,
    paddingBottom: 90,
  },

  searchContainer: {
    paddingHorizontal: 12,
    marginBottom: 10,
  },

  searchInput: {
    height: 42,
    borderRadius: 12,

    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',

    paddingHorizontal: 14,
    color: '#ffffff',
  },

  tagCard: {
    flexDirection: 'row',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 10,

    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },

  countBadge: {
    width: 70,
    backgroundColor: '#5a4636',   // ✅ Cinematic brown accent
    justifyContent: 'center',
    alignItems: 'center',
  },

  countText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },

  tagLabel: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },

  tagText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },

  pagination: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    backgroundColor: 'rgba(20,20,30,0.95)',
    padding: 10,
    borderRadius: 14,

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },

  pageButton: {
    paddingHorizontal: 10,
  },

  pageButtonText: {
    color: '#7c3aed',
    fontSize: 13,
    fontWeight: '600',
  },

  pageIndicator: {
    color: '#ffffff',
    fontWeight: '600',
  },

  disabled: {
    opacity: 0.35,
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
