// ==========================================
// NAVIGATION: Điều hướng giữa các màn hình
// ==========================================

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import RoomListScreen from '../views/screens/RoomListScreen';
import AddEditRoomScreen from '../views/screens/AddEditRoomScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
    return (
        <Stack.Navigator
            initialRouteName="RoomList"
            screenOptions={{
                headerShown: false, // Tự custom header trong mỗi screen
            }}
        >
            <Stack.Screen name="RoomList" component={RoomListScreen} />
            <Stack.Screen name="AddEditRoom" component={AddEditRoomScreen} />
        </Stack.Navigator>
    );
};
