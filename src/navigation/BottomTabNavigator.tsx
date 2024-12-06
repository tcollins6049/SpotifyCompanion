import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import LibraryScreen from '../screens/LibraryScreen';
import LibraryStackNavigator from './LibraryStackNavigator';

const Tab = createBottomTabNavigator();


const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
        screenOptions={{
            tabBarStyle: {
                backgroundColor: 'rgba(10, 12, 14, 0)', // Transparent black
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                elevation: 0,
                borderTopWidth: 0,
                height: 60
            },
            tabBarActiveTintColor: '#FFFFFF', // Active icon color
            tabBarInactiveTintColor: '#B0B0B0', // Inactive icon color
        }}
    >
        <Tab.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="home-sharp" color={color} size={25} />
                ),
            }}
        />
        <Tab.Screen 
            name="Search" 
            component={SearchScreen}
            options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="search" color={color} size={25} />
                ),
            }}
        />
        <Tab.Screen 
            name="Library" 
            component={LibraryStackNavigator} 
            options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="albums" color={color} size={25} />
                ),
            }}
        />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
