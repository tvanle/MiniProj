import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const exploreItems = [
  { id: '1', title: 'Trending', icon: 'trending-up' as const, color: '#e74c3c' },
  { id: '2', title: 'Âm nhạc', icon: 'musical-notes' as const, color: '#9b59b6' },
  { id: '3', title: 'Thể thao', icon: 'football' as const, color: '#2ecc71' },
  { id: '4', title: 'Game', icon: 'game-controller' as const, color: '#3498db' },
  { id: '5', title: 'Tin tức', icon: 'newspaper' as const, color: '#e67e22' },
  { id: '6', title: 'Học tập', icon: 'school' as const, color: '#1abc9c' },
];

export default function ExploreTab() {
  return (
    <View style={styles.container}>
      <FlatList
        data={exploreItems}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.card, { borderLeftColor: item.color }]}>
            <Ionicons name={item.icon} size={32} color={item.color} />
            <Text style={styles.title}>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  list: {
    padding: 8,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 6,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  title: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});
