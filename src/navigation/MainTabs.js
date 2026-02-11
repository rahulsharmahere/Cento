import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeStack from './HomeStack';
import ScenesStack from './ScenesStack';

import ImagesScreen from '../screens/ImagesScreen';
import StudiosScreen from '../screens/StudiosScreen';
import SettingsScreen from '../screens/SettingsScreen';

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

      {/* ✅ Home Stack */}
      <Tab.Screen
        name="Home"
        component={HomeStack}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();

            navigation.navigate('Home', {
              screen: 'HomeMain',
            });
          },
        })}
      />

      {/* ✅ Scenes Stack */}
      <Tab.Screen name="Scenes" component={ScenesStack} />

      {/* ✅ Standalone */}
      <Tab.Screen name="Images" component={ImagesScreen} />
      <Tab.Screen name="Studios" component={StudiosScreen} />

      {/* ✅ FIXED → Tags now uses HomeStack */}
      <Tab.Screen
        name="Tags"
        component={HomeStack}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();

            navigation.navigate('Tags', {
              screen: 'Tags',
            });
          },
        })}
      />

      {/* ✅ Settings */}
      <Tab.Screen name="Settings" component={SettingsScreen} />

    </Tab.Navigator>
  );
}
