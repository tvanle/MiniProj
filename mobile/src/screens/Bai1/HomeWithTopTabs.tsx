import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import TopTabNavigator from '../../navigation/TopTabNavigator';

export default function HomeWithTopTabs() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
          <Ionicons name="menu" size={26} color="#333" />
        </TouchableOpacity>
        <Text style={styles.logo}>MiniApp</Text>
        <View style={styles.headerIcons}>
          <Ionicons name="search" size={24} color="#333" style={styles.icon} />
          <Ionicons name="notifications-outline" size={24} color="#333" style={styles.icon} />
        </View>
      </View>
      <TopTabNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#fff',
  },
  logo: { fontSize: 22, fontWeight: 'bold', color: '#e74c3c' },
  headerIcons: { flexDirection: 'row' },
  icon: { marginLeft: 18 },
});
