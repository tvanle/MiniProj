import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const gamingItems = [
  { id: '1', title: 'PUBG Mobile Highlights', viewers: '12K đang xem', live: true },
  { id: '2', title: 'Genshin Impact Guide', viewers: '8K đang xem', live: true },
  { id: '3', title: 'League of Legends Tips', viewers: '5K đang xem', live: false },
  { id: '4', title: 'Minecraft Building', viewers: '3K đang xem', live: false },
];

export default function GamingPage() {
  return (
    <FlatList
      style={styles.container}
      data={gamingItems}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <View style={styles.thumbnail}>
            <Ionicons name="game-controller" size={30} color="#3498db" />
            {item.live && (
              <View style={styles.liveBadge}>
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            )}
          </View>
          <View style={styles.info}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.viewers}>{item.viewers}</Text>
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
  thumbnail: {
    width: 80,
    height: 55,
    backgroundColor: '#e3f2fd',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  liveBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#e74c3c',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  liveText: { color: '#fff', fontSize: 8, fontWeight: 'bold' },
  info: { flex: 1 },
  title: { fontSize: 14, fontWeight: '600', color: '#1a1a1a' },
  viewers: { fontSize: 12, color: '#888', marginTop: 4 },
});
