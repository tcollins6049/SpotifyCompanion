import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ScrollView, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { fetchAllUserPlaylists } from '../spotify/SpotifyService';
import { useSpotifyAuth } from '../context/SpotifyAuthContext';
import { RootStackParamList } from '../../App';


type LibraryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PlaylistDetails'>;

const LibraryScreen = () => {
  const navigation = useNavigation<LibraryScreenNavigationProp>();

  const { accessToken } = useSpotifyAuth();
  const [playlists, setPlaylists] = useState<any[]>([]);

  useEffect(() => {
    if (accessToken) {
      const getUserPlaylists = async () => {
        try {
          const userPlaylists = await fetchAllUserPlaylists(accessToken);
          console.log(userPlaylists)
          setPlaylists(userPlaylists);
        } catch (error) {
          console.error('Error fetching user playlists:', error);
        }
      }

      getUserPlaylists();
    }
  }, [accessToken]);


  const renderPlaylist = ({ item }: { item: any }) => {
    console.log("ITEM")
    console.log(item)
    const imageUrl = item.images && item.images.length > 0 ? item.images[0].url : null;
    
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('PlaylistDetails', { 
          playlistId: item.id,
          accessToken,
          href: item.tracks.href,
          playlist_info: item
        })}
        key={item.id}
      >
      <View style={styles.playlistItem} key={item.id}>
        {imageUrl && <Image source={{ uri: imageUrl }} style={styles.playlistImage} />}
        <View style={styles.playlistTextContainer}>
          <Text style={styles.playlistName}>{item.name}</Text>
          <Text style={styles.trackCount}>Total Songs: {item.tracks.total}</Text>
        </View>
      </View>
      </TouchableOpacity>
    );
  };


  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <LinearGradient 
        colors={['#4d646f', '#3a4b53', '#263238', '#1d262a', '#13191c', '#0a0c0e']}
        start={{x: 0.5, y: 0}}
        end={{x: 0.5, y: 0.2 }}
        style={styles.container}
      >
          <Text style={styles.title}>Your Playlists</Text>
          {playlists.length > 0 ? (
            playlists.map((playlist) => renderPlaylist({ item: playlist }))
          ) : (
            <Text style={styles.noPlaylistsText}>No playlists found</Text>
          )}
      </LinearGradient>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  playlistItem: {
    flexDirection: 'row', // Row layout to align image and text horizontally
    alignItems: 'center', // Vertically center the items
    marginBottom: 5,
    padding: 10,
    backgroundColor: 'rgba(46, 59, 67, 0)',
    borderRadius: 10,
  },
  playlistName: {
    fontSize: 18,
    color: '#ffffff',
  },
  trackCount: {
    fontSize: 14,
    color: '#cccccc',
  },
  noPlaylistsText: {
    fontSize: 16,
    color: '#ffffff',
  },
  playlistTextContainer: {
    flex: 1,
  },
  playlistImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
});

export default LibraryScreen;
