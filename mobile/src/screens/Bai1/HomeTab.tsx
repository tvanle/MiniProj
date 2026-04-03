import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

export default function HomeTab() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Trang chủ</Text>
        <Text style={styles.cardText}>
          Chào mừng bạn đến với ứng dụng MiniProject 02.
        </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Bài viết mới</Text>
        <Text style={styles.cardText}>
          Đây là nội dung bài viết mẫu hiển thị trên tab Home.
        </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tin tức</Text>
        <Text style={styles.cardText}>
          Cập nhật tin tức mới nhất từ cộng đồng.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  card: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 16,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
