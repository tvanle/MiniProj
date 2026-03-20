/**
 * AppNavigator - Dieu huong ung dung
 * Quan ly navigation giua LoginScreen va ScoreScreen
 */

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import ScoreScreen from '../screens/ScoreScreen';
import { storageHelper } from '../dal/StorageHelper';
import { dbHelper } from '../dal/DBHelper';

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
        // Khoi tao database
        await dbHelper.open();

        // Kiem tra trang thai login tu AsyncStorage
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
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={isLoggedIn ? 'Score' : 'Login'}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Score" component={ScoreScreen} />
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
