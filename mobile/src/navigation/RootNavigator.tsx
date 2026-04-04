import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/ThucHanh1/LoginScreen';
import BookingScreen from '../screens/ThucHanh1/BookingScreen';

const Stack = createNativeStackNavigator();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen
        name="Booking"
        component={BookingScreen}
        options={{ headerShown: true, title: 'Đặt Vé Máy Bay' }}
      />
    </Stack.Navigator>
  );
};
