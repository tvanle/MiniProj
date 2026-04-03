import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import TrendingPage from '../screens/Bai1/TopTabs/TrendingPage';
import MusicPage from '../screens/Bai1/TopTabs/MusicPage';
import GamingPage from '../screens/Bai1/TopTabs/GamingPage';

const TopTab = createMaterialTopTabNavigator();

export default function TopTabNavigator() {
  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600', textTransform: 'none' },
        tabBarIndicatorStyle: { backgroundColor: '#e74c3c', height: 3 },
        tabBarActiveTintColor: '#e74c3c',
        tabBarInactiveTintColor: '#888',
        tabBarScrollEnabled: true,
        tabBarItemStyle: { width: 'auto', paddingHorizontal: 16 },
        tabBarStyle: { backgroundColor: '#fff', elevation: 0 },
      }}
    >
      <TopTab.Screen name="Trending" component={TrendingPage} />
      <TopTab.Screen name="Âm nhạc" component={MusicPage} />
      <TopTab.Screen name="Gaming" component={GamingPage} />
    </TopTab.Navigator>
  );
}
