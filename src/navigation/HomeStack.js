import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import PerformersScreen from '../screens/PerformersScreen';
import TagsScreen from '../screens/TagsScreen';
import SceneDetailScreen from '../screens/SceneDetailScreen';
import ScenePlayerScreen from '../screens/ScenePlayerScreen';
import PerformerScreen from '../screens/PerformerScreen';
import TagDetailScreen from '../screens/TagDetailScreen';

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Performers" component={PerformersScreen} />
      <Stack.Screen name="Performer" component={PerformerScreen} />
      <Stack.Screen name="Tags" component={TagsScreen} />
      <Stack.Screen name="TagDetail" component={TagDetailScreen} />
      <Stack.Screen name="SceneDetail" component={SceneDetailScreen} />
      <Stack.Screen
        name="ScenePlayer"
        component={ScenePlayerScreen}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}
