import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Showtime, Theater } from '../../models/types';
import { getShowtimesForMovie, getTheaterById } from '../../services/movie-service';
import { formatPrice, formatTime, formatDateLabel } from '../../utils/formatters';

type Props = NativeStackScreenProps<RootStackParamList, 'MovieDetail'>;

// Group showtimes by date
const groupByDate = (showtimes: Showtime[]) => {
  const groups: Record<string, Showtime[]> = {};
  for (const st of showtimes) {
    const date = st.dateTime.split('T')[0];
    if (!groups[date]) groups[date] = [];
    groups[date].push(st);
  }
  return groups;
};

export default function MovieDetailScreen({ route, navigation }: Props) {
  const { movie } = route.params;
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [theaters, setTheaters] = useState<Record<string, Theater>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const sts = await getShowtimesForMovie(movie.id);
        setShowtimes(sts);

        // Load unique theaters
        const theaterIds = [...new Set(sts.map((s) => s.theaterId))];
        const theaterMap: Record<string, Theater> = {};
        for (const tid of theaterIds) {
          const t = await getTheaterById(tid);
          if (t) theaterMap[tid] = t;
        }
        setTheaters(theaterMap);
      } catch (error) {
        console.error('Failed to load showtimes:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [movie.id]);

  const grouped = groupByDate(showtimes);

  return (
    <ScrollView style={styles.container}>
      {/* Movie Header */}
      <View style={styles.header}>
        <Image source={{ uri: movie.poster }} style={styles.poster} />
        <View style={styles.headerInfo}>
          <Text style={styles.title}>{movie.title}</Text>
          <Text style={styles.genre}>{movie.genre}</Text>
          <Text style={styles.rating}>⭐ {movie.rating}/10</Text>
          <Text style={styles.duration}>⏱ {movie.duration} phút</Text>
        </View>
      </View>

      {/* Description */}
      <Text style={styles.description}>{movie.description}</Text>

      {/* Showtimes */}
      <Text style={styles.sectionTitle}>Lịch Chiếu</Text>

      {loading ? (
        <ActivityIndicator color="#e94560" style={{ marginTop: 20 }} />
      ) : (
        Object.entries(grouped).map(([date, sts]) => (
          <View key={date} style={styles.dateGroup}>
            <Text style={styles.dateLabel}>{formatDateLabel(date)}</Text>
            {/* Group by theater */}
            {Object.entries(
              sts.reduce<Record<string, Showtime[]>>((acc, s) => {
                if (!acc[s.theaterId]) acc[s.theaterId] = [];
                acc[s.theaterId].push(s);
                return acc;
              }, {})
            ).map(([theaterId, theaterShowtimes]) => (
              <View key={theaterId} style={styles.theaterGroup}>
                <Text style={styles.theaterName}>
                  🏢 {theaters[theaterId]?.name || theaterId}
                </Text>
                <View style={styles.timesRow}>
                  {theaterShowtimes.map((st) => (
                    <TouchableOpacity
                      key={st.id}
                      style={styles.timeBtn}
                      onPress={() =>
                        navigation.navigate('BookTicket', {
                          movie,
                          showtime: st,
                          theater: theaters[theaterId],
                        })
                      }
                    >
                      <Text style={styles.timeText}>{formatTime(st.dateTime)}</Text>
                      <Text style={styles.priceText}>{formatPrice(st.price)}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </View>
        ))
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  header: { flexDirection: 'row', padding: 16, gap: 16 },
  poster: { width: 130, height: 195, borderRadius: 12 },
  headerInfo: { flex: 1, justifyContent: 'center', gap: 6 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  genre: { fontSize: 14, color: '#aaa' },
  rating: { fontSize: 16, color: '#ffd700' },
  duration: { fontSize: 14, color: '#aaa' },
  description: { color: '#ccc', fontSize: 14, lineHeight: 22, paddingHorizontal: 16 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  dateGroup: { paddingHorizontal: 16, marginBottom: 16 },
  dateLabel: { fontSize: 16, fontWeight: '600', color: '#e94560', marginBottom: 8 },
  theaterGroup: { marginBottom: 12 },
  theaterName: { fontSize: 14, color: '#ccc', marginBottom: 6 },
  timesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  timeBtn: {
    backgroundColor: '#0f3460',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
  },
  timeText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  priceText: { color: '#aaa', fontSize: 11, marginTop: 2 },
});
