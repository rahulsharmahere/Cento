import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from '../screens/HomeScreen';
import ScenesScreen from '../screens/ScenesScreen';
import ImagesScreen from '../screens/ImagesScreen';
import StudiosScreen from '../screens/StudiosScreen';
import TagsScreen from '../screens/TagsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import HomeStack from './HomeStack';
import ScenesStack from './ScenesStack';

const Tab = createBottomTabNavigator();

function TabBarIcon({ name, color, size }) {
  return <Icon name={name} size={size} color={color} />;
}

export default function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName = 'dashboard';

          switch (route.name) {
            case 'Home':
              iconName = 'dashboard';
              break;
            case 'Scenes':
              iconName = 'movie';
              break;
            case 'Images':
              iconName = 'photo-library';
              break;
            case 'Studios':
              iconName = 'business';
              break;
            case 'Tags':
              iconName = 'local-offer';
              break;
            case 'Settings':
              iconName = 'settings';
              break;
          }

          return <TabBarIcon name={iconName} color={color} size={size} />;
        },
      })}
    >
      {/* 🔑 THESE MUST EXIST */}
       <Tab.Screen
  name="Home"
  component={HomeStack}
  listeners={({ navigation }) => ({
    tabPress: e => {
      // Prevent default behavior
      e.preventDefault();

      // Always go to HomeScreen (root of stack)
      navigation.navigate('Home', {
        screen: 'HomeMain',
      });
    },
  })}
/>

      <Tab.Screen name="Scenes" component={ScenesStack} />
      <Tab.Screen name="Images" component={ImagesScreen} />
      <Tab.Screen name="Studios" component={StudiosScreen} />
      <Tab.Screen name="Tags" component={TagsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
     
    </Tab.Navigator>
  );
}
