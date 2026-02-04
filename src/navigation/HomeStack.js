import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import PerformersScreen from '../screens/PerformersScreen';
import SceneDetailScreen from '../screens/SceneDetailScreen';
import ScenePlayerScreen from '../screens/ScenePlayerScreen';

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />

      {/* Works already – bottom tab visible */}
      <Stack.Screen name="Performers" component={PerformersScreen} />

      {/* ADD THIS – same behavior as Performers */}
      <Stack.Screen name="SceneDetail" component={SceneDetailScreen} />

      {/* Optional fullscreen player */}
      <Stack.Screen
        name="ScenePlayer"
        component={ScenePlayerScreen}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}
