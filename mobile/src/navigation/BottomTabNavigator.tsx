import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeWithTopTabs from '../screens/Bai1/HomeWithTopTabs';
import ExploreTab from '../screens/Bai1/ExploreTab';
import SubscriptionsTab from '../screens/Bai1/SubscriptionsTab';
import InboxTab from '../screens/Bai1/InboxTab';
import LibraryTab from '../screens/Bai1/LibraryTab';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Explore':
              iconName = focused ? 'compass' : 'compass-outline';
              break;
            case 'Subscriptions':
              iconName = focused ? 'play-circle' : 'play-circle-outline';
              break;
            case 'Inbox':
              iconName = focused ? 'mail' : 'mail-outline';
              break;
            case 'Library':
              iconName = focused ? 'library' : 'library-outline';
              break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#e74c3c',
        tabBarInactiveTintColor: '#888',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          paddingBottom: 4,
          height: 56,
        },
        tabBarLabelStyle: { fontSize: 10 },
      })}
    >
      <Tab.Screen name="Home" component={HomeWithTopTabs} />
      <Tab.Screen name="Explore" component={ExploreTab} />
      <Tab.Screen name="Subscriptions" component={SubscriptionsTab} />
      <Tab.Screen name="Inbox" component={InboxTab} options={{ tabBarBadge: 3 }} />
      <Tab.Screen name="Library" component={LibraryTab} />
    </Tab.Navigator>
  );
}
