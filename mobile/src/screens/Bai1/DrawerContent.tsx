import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer';

const menuItems = [
  { label: 'Recent', icon: 'time-outline' as const, screen: 'MainTabs' },
  { label: 'Offline', icon: 'cloud-offline-outline' as const, screen: 'MainTabs' },
  { label: 'Notifications', icon: 'notifications-outline' as const, screen: 'MainTabs' },
  { label: 'Backups', icon: 'cloud-upload-outline' as const, screen: 'MainTabs' },
  { label: 'Settings', icon: 'settings-outline' as const, screen: 'MainTabs' },
  { label: 'Help & feedback', icon: 'help-circle-outline' as const, screen: 'MainTabs' },
];

export default function DrawerContent(props: DrawerContentComponentProps) {
  return (
    <DrawerContentScrollView {...props} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Ionicons name="apps" size={28} color="#4285F4" />
          <Text style={styles.appName}>MiniApp</Text>
        </View>
        <View style={styles.userRow}>
          <Ionicons name="person-circle" size={50} color="#ccc" />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>User</Text>
            <Text style={styles.userEmail}>user@example.com</Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      {menuItems.map((item) => (
        <TouchableOpacity
          key={item.label}
          style={styles.menuItem}
          onPress={() => props.navigation.navigate(item.screen)}
        >
          <Ionicons name={item.icon} size={22} color="#555" />
          <Text style={styles.menuLabel}>{item.label}</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.divider} />

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => props.navigation.navigate('Schedule')}
      >
        <Ionicons name="calendar-outline" size={22} color="#3498db" />
        <Text style={[styles.menuLabel, { color: '#3498db' }]}>Đặt lịch (Bài 2)</Text>
      </TouchableOpacity>

      <View style={styles.storageSection}>
        <View style={styles.storageRow}>
          <Ionicons name="server-outline" size={20} color="#555" />
          <Text style={styles.storageLabel}>Storage (17% full)</Text>
        </View>
        <View style={styles.storageBar}>
          <View style={[styles.storageUsed, { width: '17%' }]} />
        </View>
        <Text style={styles.storageText}>2.6 GB of 15.0 GB used</Text>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20, paddingTop: 10 },
  logoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  appName: { fontSize: 22, fontWeight: '600', marginLeft: 10, color: '#333' },
  userRow: { flexDirection: 'row', alignItems: 'center' },
  userInfo: { marginLeft: 12 },
  userName: { fontSize: 16, fontWeight: '600', color: '#1a1a1a' },
  userEmail: { fontSize: 13, color: '#888' },
  divider: { height: 1, backgroundColor: '#e0e0e0', marginVertical: 8 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 20,
  },
  menuLabel: { fontSize: 15, marginLeft: 20, color: '#333' },
  storageSection: { padding: 20, paddingTop: 12 },
  storageRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  storageLabel: { fontSize: 14, marginLeft: 10, color: '#555' },
  storageBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginBottom: 6,
  },
  storageUsed: { height: 6, backgroundColor: '#4285F4', borderRadius: 3 },
  storageText: { fontSize: 12, color: '#888' },
});
