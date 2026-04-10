import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { User as FirebaseUser } from 'firebase/auth';
import { RootStackParamList, MainTabParamList } from '../models/types';
import { subscribeAuthState, checkGoogleRedirect } from '../services/auth-service';
import { registerForPushNotifications } from '../services/notification-service';

// Screens
import LoginScreen from '../screens/auth/login-screen';
import RegisterScreen from '../screens/auth/register-screen';
import MovieListScreen from '../screens/movies/movie-list-screen';
import MovieDetailScreen from '../screens/movies/movie-detail-screen';
import BookTicketScreen from '../screens/booking/book-ticket-screen';
import MyTicketsScreen from '../screens/tickets/my-tickets-screen';
import ProfileScreen from '../screens/profile/profile-screen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const headerOptions = {
  headerStyle: { backgroundColor: '#0f3460' },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: 'bold' as const },
};

// Simple text-based tab icon
function TabIcon({ label, color }: { label: string; color: string }) {
  return <Text style={{ fontSize: 20, color }}>{label}</Text>;
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        ...headerOptions,
        tabBarStyle: { backgroundColor: '#0f3460', borderTopColor: '#1a1a2e' },
        tabBarActiveTintColor: '#e94560',
        tabBarInactiveTintColor: '#aaa',
      }}
    >
      <Tab.Screen
        name="Movies"
        component={MovieListScreen}
        options={{
          title: 'Phim',
          tabBarIcon: ({ color }) => <TabIcon label="🎬" color={color} />,
        }}
      />
      <Tab.Screen
        name="MyTickets"
        component={MyTicketsScreen}
        options={{
          title: 'Vé Của Tôi',
          tabBarIcon: ({ color }) => <TabIcon label="🎟" color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Tài Khoản',
          tabBarIcon: ({ color }) => <TabIcon label="👤" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkGoogleRedirect(); // Handle Google redirect on web
    const unsubscribe = subscribeAuthState((u) => {
      setUser(u);
      setLoading(false);
      if (u) registerForPushNotifications();
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a2e' }}>
        <ActivityIndicator size="large" color="#e94560" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={headerOptions}>
      {user ? (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen name="MovieDetail" component={MovieDetailScreen} options={{ title: 'Chi Tiết Phim' }} />
          <Stack.Screen name="BookTicket" component={BookTicketScreen} options={{ title: 'Đặt Vé' }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Đăng Ký' }} />
        </>
      )}
    </Stack.Navigator>
  );
}
