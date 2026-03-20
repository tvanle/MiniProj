/**
 * AppNavigator - Dieu huong ung dung
 * Quan ly navigation giua LoginScreen va ScoreScreen
 *
 * Su dung Room Database pattern (Bai 2)
 */

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Bai 2: Room Database pattern
import LoginScreenRoom from '../screens/LoginScreenRoom';
import ScoreScreenRoom from '../screens/ScoreScreenRoom';
import { AppDB } from '../dal/AppDB';
import { storageHelper } from '../dal/StorageHelper';

export type RootStackParamList = {
  Login: undefined;
  Score: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        // Khoi tao Room Database
        await AppDB.getInstance();

        // Kiem tra trang thai login tu AsyncStorage (SharedPreferences)
        const loggedIn = await storageHelper.isLoggedIn();
        setIsLoggedIn(loggedIn);
      } catch (error) {
        console.error('Init error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#5856D6" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={isLoggedIn ? 'Score' : 'Login'}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreenRoom} />
      <Stack.Screen name="Score" component={ScoreScreenRoom} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});
