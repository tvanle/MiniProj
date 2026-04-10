import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Movie } from '../../models/types';
import { getMovies, seedDatabase } from '../../services/movie-service';
import MovieCard from '../../components/movie-card';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export default function MovieListScreen({ navigation }: Props) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadMovies = useCallback(async () => {
    try {
      await seedDatabase();
      const data = await getMovies();
      setMovies(data);
    } catch (error) {
      console.error('Failed to load movies:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  const onRefresh = () => {
    setRefreshing(true);
    loadMovies();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#e94560" />
        <Text style={styles.loadingText}>Đang tải phim...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MovieCard
            movie={item}
            onPress={() => navigation.navigate('MovieDetail', { movie: item })}
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#e94560" />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>Không có phim nào</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a2e' },
  loadingText: { color: '#aaa', marginTop: 12, fontSize: 16 },
  list: { paddingVertical: 8 },
  emptyText: { color: '#aaa', textAlign: 'center', marginTop: 40, fontSize: 16 },
});
