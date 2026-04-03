import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const libraryItems = [
  { id: '1', title: 'Lịch sử xem', icon: 'time' as const, count: 24 },
  { id: '2', title: 'Video đã lưu', icon: 'bookmark' as const, count: 12 },
  { id: '3', title: 'Danh sách phát', icon: 'list' as const, count: 5 },
  { id: '4', title: 'Video đã tải', icon: 'download' as const, count: 8 },
  { id: '5', title: 'Video đã thích', icon: 'heart' as const, count: 35 },
];

export default function LibraryTab() {
  return (
    <View style={styles.container}>
      <FlatList
        data={libraryItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Ionicons name={item.icon} size={24} color="#555" />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.count}>{item.count}</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
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
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 10,
    marginVertical: 3,
    borderRadius: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    marginLeft: 14,
    color: '#333',
  },
  count: {
    fontSize: 14,
    color: '#888',
    marginRight: 8,
  },
});
