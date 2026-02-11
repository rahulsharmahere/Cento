import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BootstrapScreen from '../screens/BootstrapScreen';
import LoginScreen from '../screens/LoginScreen';
import MainTabs from './MainTabs';
import SceneDetailScreen from '../screens/SceneDetailScreen';



const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Bootstrap" component={BootstrapScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="SceneDetail" component={SceneDetailScreen} />



    </Stack.Navigator>
  );
}
