// src/navigation/LibraryStackNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LibraryScreen from '../screens/LibraryScreen';
import PlaylistDetailsScreen from '../screens/PlaylistDetailsScreen';
import { RootStackParamList } from '../../App';

const Stack = createStackNavigator<RootStackParamList>();

const LibraryStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#000000'
        },
        headerTintColor: '#cccccc',
        headerTitle: ''
      }}
    >
      <Stack.Screen 
        name="Playlist_Library" 
        component={LibraryScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="PlaylistDetails" 
        component={PlaylistDetailsScreen} 
      />
    </Stack.Navigator>
  );
}

export default LibraryStackNavigator;
