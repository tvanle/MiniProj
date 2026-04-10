import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth } from '../../config/firebase-config';
import { logoutUser } from '../../services/auth-service';

export default function ProfileScreen() {
  const user = auth.currentUser;

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: async () => {
          try {
            await logoutUser();
          } catch (error) {
            Alert.alert('Lỗi', 'Đăng xuất thất bại');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {user?.displayName?.[0]?.toUpperCase() || '?'}
        </Text>
      </View>

      <Text style={styles.name}>{user?.displayName || 'Người dùng'}</Text>
      <Text style={styles.email}>{user?.email}</Text>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{user?.email}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Tên hiển thị</Text>
          <Text style={styles.infoValue}>{user?.displayName}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Đăng Xuất</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', alignItems: 'center', padding: 24, paddingTop: 40 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e94560',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: { fontSize: 36, fontWeight: 'bold', color: '#fff' },
  name: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  email: { fontSize: 15, color: '#aaa', marginBottom: 24 },
  infoCard: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 32,
  },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  infoLabel: { fontSize: 15, color: '#aaa' },
  infoValue: { fontSize: 15, color: '#fff', flex: 1, textAlign: 'right', marginLeft: 16 },
  divider: { height: 1, backgroundColor: '#0f3460' },
  logoutBtn: {
    backgroundColor: '#e94560',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
  },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
