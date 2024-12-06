import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';

import SignInScreen from './src/screens/SignInScreen';  // Sign in page
import HomeScreen from './src/screens/HomeScreen';      // Main app page
import { SpotifyAuthProvider } from './src/context/SpotifyAuthContext';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import PlaylistDetailsScreen from './src/screens/PlaylistDetailsScreen';


export type RootStackParamList = {
  SignIn: undefined; // The SignIn screen doesn't take any parameters
  Main: undefined;   // The Main screen also doesn't take parameters, change to `{ someParam: string }` if it does
  Playlist_Library: undefined;
  PlaylistDetails: { playlistId: string; accessToken: string | null; href: string, playlist_info: any };
  TrackPlayback: { songName: string, songId: string }
};
const Stack = createStackNavigator<RootStackParamList>();


const App = () => {
  return (
    <>
    <StatusBar barStyle="light-content" backgroundColor="#000000" />
    <SpotifyAuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SignIn">
          <Stack.Screen name="SignIn" component={SignInScreen} />
          {/*<Stack.Screen name="Home" component={HomeScreen} />*/}
          <Stack.Screen
            name="Main"
            component={BottomTabNavigator}
            options={{ headerShown: false }}  // Hides the header for the tab navigation
          />
          {/*<Stack.Screen name="PlaylistDetails" component={PlaylistDetailsScreen} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </SpotifyAuthProvider>
    </>
  );
}

export default App;
