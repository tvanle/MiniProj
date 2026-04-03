import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const subscriptions = [
  { id: '1', name: 'Tech Channel', subscribers: '1.2M', hasNew: true },
  { id: '2', name: 'Music Hits', subscribers: '850K', hasNew: true },
  { id: '3', name: 'Daily News', subscribers: '2.1M', hasNew: false },
  { id: '4', name: 'Gaming Pro', subscribers: '500K', hasNew: false },
  { id: '5', name: 'Cooking Show', subscribers: '300K', hasNew: true },
];

export default function SubscriptionsTab() {
  return (
    <View style={styles.container}>
      <FlatList
        data={subscriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.avatar}>
              <Ionicons name="person-circle" size={48} color="#ccc" />
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.subs}>{item.subscribers} subscribers</Text>
            </View>
            {item.hasNew && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>NEW</Text>
              </View>
            )}
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
    padding: 14,
    marginHorizontal: 10,
    marginVertical: 4,
    borderRadius: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  avatar: {
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  subs: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
