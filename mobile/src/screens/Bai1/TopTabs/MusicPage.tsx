import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const musicItems = [
  { id: '1', title: 'Lo-fi Beats to Study', artist: 'Lofi Girl', plays: '5.2M' },
  { id: '2', title: 'EDM Mix 2024', artist: 'DJ Studio', plays: '3.1M' },
  { id: '3', title: 'Nhạc Việt Hot', artist: 'Various Artists', plays: '2.8M' },
  { id: '4', title: 'Acoustic Covers', artist: 'Music Lab', plays: '1.5M' },
  { id: '5', title: 'K-Pop Hits', artist: 'Korean Wave', plays: '4.7M' },
];

export default function MusicPage() {
  return (
    <FlatList
      style={styles.container}
      data={musicItems}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <View style={styles.albumArt}>
            <Ionicons name="musical-notes" size={28} color="#9b59b6" />
          </View>
          <View style={styles.info}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.artist}>{item.artist}</Text>
          </View>
          <Text style={styles.plays}>{item.plays}</Text>
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
  albumArt: {
    width: 50,
    height: 50,
    backgroundColor: '#f3e5f5',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  info: { flex: 1 },
  title: { fontSize: 15, fontWeight: '600', color: '#1a1a1a' },
  artist: { fontSize: 12, color: '#888', marginTop: 2 },
  plays: { fontSize: 12, color: '#aaa' },
});
