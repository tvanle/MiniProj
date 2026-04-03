import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const messages = [
  { id: '1', sender: 'Admin', message: 'Chào mừng bạn đến với ứng dụng!', time: '10:30', read: true },
  { id: '2', sender: 'Hệ thống', message: 'Bạn có 3 thông báo mới', time: '09:15', read: false },
  { id: '3', sender: 'Nhóm học tập', message: 'Bài tập mới đã được giao', time: 'Hôm qua', read: false },
  { id: '4', sender: 'Support', message: 'Phản hồi của bạn đã được ghi nhận', time: 'Hôm qua', read: true },
];

export default function InboxTab() {
  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.item, !item.read && styles.unread]}>
            <View style={styles.iconWrap}>
              <Ionicons
                name={item.read ? 'mail-open' : 'mail'}
                size={24}
                color={item.read ? '#aaa' : '#3498db'}
              />
            </View>
            <View style={styles.content}>
              <Text style={[styles.sender, !item.read && styles.boldText]}>
                {item.sender}
              </Text>
              <Text style={styles.message} numberOfLines={1}>
                {item.message}
              </Text>
            </View>
            <Text style={styles.time}>{item.time}</Text>
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
    marginVertical: 3,
    borderRadius: 8,
  },
  unread: {
    backgroundColor: '#eaf4ff',
  },
  iconWrap: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  sender: {
    fontSize: 15,
    color: '#333',
  },
  boldText: {
    fontWeight: 'bold',
  },
  message: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    color: '#aaa',
  },
});
