import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const trendingItems = [
  { id: '1', title: 'React Native Tutorial 2024', views: '1.2M views', duration: '12:30' },
  { id: '2', title: 'Top 10 ứng dụng Mobile hay nhất', views: '890K views', duration: '8:45' },
  { id: '3', title: 'Hướng dẫn lập trình Android cơ bản', views: '650K views', duration: '15:20' },
  { id: '4', title: 'Expo vs React Native CLI', views: '450K views', duration: '10:15' },
];

export default function TrendingPage() {
  return (
    <FlatList
      style={styles.container}
      data={trendingItems}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <View style={styles.item}>
          <Text style={styles.rank}>#{index + 1}</Text>
          <View style={styles.thumbnail}>
            <Ionicons name="play-circle" size={40} color="#e74c3c" />
          </View>
          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.meta}>{item.views} • {item.duration}</Text>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  rank: { fontSize: 18, fontWeight: 'bold', color: '#e74c3c', width: 30 },
  thumbnail: {
    width: 80,
    height: 55,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  info: { flex: 1 },
  title: { fontSize: 14, fontWeight: '600', color: '#1a1a1a' },
  meta: { fontSize: 12, color: '#888', marginTop: 4 },
});
