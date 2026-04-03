import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTabNavigator from './BottomTabNavigator';
import ScheduleScreen from '../screens/Bai2/ScheduleScreen';
import DrawerContent from '../screens/Bai1/DrawerContent';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: { width: 280 },
      }}
    >
      <Drawer.Screen name="MainTabs" component={BottomTabNavigator} />
      <Drawer.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{ headerShown: true, title: 'Đặt lịch' }}
      />
    </Drawer.Navigator>
  );
}
