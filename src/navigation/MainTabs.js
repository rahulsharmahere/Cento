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

export default function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,   // ✅ ensure labels enabled

  tabBarActiveTintColor: '#7c3aed',     // 💜 Active Purple
  tabBarInactiveTintColor: '#a1a1aa',   // ✅ Visible Cinematic Grey


        tabBarStyle: {
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,

          backgroundColor: 'rgba(20,20,30,0.95)',   // ✨ Glass cinematic surface
          borderTopWidth: 1,
          borderColor: 'rgba(255,255,255,0.06)',

          elevation: 0,   // Removes ugly Android shadow
        },

        tabBarIcon: ({ focused }) => {
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

          return (
            <Icon
              name={iconName}
              size={24}
              color={focused ? '#7c3aed' : '#71717a'}   // 💜 Purple active glow
            />
          );
        },
      })}
    >

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

      <Tab.Screen name="Scenes" component={ScenesStack} />
      <Tab.Screen name="Images" component={ImagesScreen} />
      <Tab.Screen name="Studios" component={StudiosScreen} />

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

      <Tab.Screen name="Settings" component={SettingsScreen} />

    </Tab.Navigator>
  );
}
