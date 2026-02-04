import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ScenesScreen from '../screens/ScenesScreen';
import SceneDetailScreen from '../screens/SceneDetailScreen';
import ScenePlayerScreen from '../screens/ScenePlayerScreen';

const Stack = createNativeStackNavigator();

export default function ScenesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ScenesMain" component={ScenesScreen} />
      <Stack.Screen name="SceneDetail" component={SceneDetailScreen} />
      <Stack.Screen name="ScenePlayer" component={ScenePlayerScreen} />
    </Stack.Navigator>
  );
}
