import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Movie } from '../models/types';

type Props = {
  movie: Movie;
  onPress: () => void;
};

export default function MovieCard({ movie, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: movie.poster }} style={styles.poster} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{movie.title}</Text>
        <Text style={styles.genre}>{movie.genre}</Text>
        <View style={styles.meta}>
          <Text style={styles.rating}>⭐ {movie.rating}</Text>
          <Text style={styles.duration}>{movie.duration} phút</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#16213e',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
  },
  poster: { width: 100, height: 150 },
  info: { flex: 1, padding: 12, justifyContent: 'center', gap: 6 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  genre: { fontSize: 14, color: '#aaa' },
  meta: { flexDirection: 'row', gap: 16, marginTop: 4 },
  rating: { fontSize: 14, color: '#ffd700' },
  duration: { fontSize: 14, color: '#aaa' },
});
