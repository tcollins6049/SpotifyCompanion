import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity 
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { RouteProp } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../../App';  // Adjust the path based on your structure
import { StackNavigationProp } from '@react-navigation/stack';
import { fetchAllPlaylistTracks } from '../spotify/SpotifyService';
import QueueService from '../song_queue/QueueService';
import PlaylistOptionsModal from '../modals/PlaylistOptionsModal';
import SongOptionsModal from '../modals/SongOptionsModal';
import { playTrack } from '../spotify/SpotifyPlayback';
import { updatePlaybackState } from '../song_queue/PlaybackState';


type PlaylistDetailsScreenRouteProp = RouteProp<RootStackParamList, 'PlaylistDetails'>;

type PlaylistDetailsScreenProps = {
  route: PlaylistDetailsScreenRouteProp;
  navigation: StackNavigationProp<RootStackParamList, 'PlaylistDetails'>;
};


const PlaylistDetailsScreen: React.FC<PlaylistDetailsScreenProps> = ({ route, navigation }) => {
  const { playlistId, accessToken, href, playlist_info } = route.params;
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [playlistOptionsModalVisible, set_playlistOptionsModalVisible] = useState(false);
  const [songOptionsModalVisible, set_songOptionsModalVisible] = useState(false);
  const [trackSelect, set_trackSelect] = useState<any>(null);

  useEffect(() => {
    if (accessToken && href) {
        const getPlaylistTracks = async () => {
            const playlistTracks = await fetchAllPlaylistTracks(href, accessToken); // Use the new method
            setTracks(playlistTracks); // Set the tracks from the fetched data
            setLoading(false);
        };
    
        getPlaylistTracks();
    }
  }, [href, accessToken]);


  const handleTrackSelect = (selectedTrack: any) => {
    if (accessToken) {
      // playTrack(accessToken, selectedTrack.track.id)
      // updatePlaybackState(selectedTrack.track.name, selectedTrack.track.artists[0].name, selectedTrack.track.id);
    }
    QueueService.queueTrackAndPlaylist(selectedTrack, tracks);
  };


  const handleSongOptions = (selectedTrack: any) => {
    set_trackSelect(selectedTrack);
    set_songOptionsModalVisible(true);
  }

  const handlePlaylistOptions = () => {
    set_playlistOptionsModalVisible(true);
  }


  const renderTrackItem = ({ item }: { item: any }) => {
    const imageUrl = item.track.album.images && item.track.album.images.length > 0 ? item.track.album.images[0].url : null;
    
    // Access the artists and join their names
    const artists: string = item.track.artists.map((artist: { name: string }) => artist.name).join(', ');

    return (
      <TouchableOpacity
        onPress={() => handleTrackSelect(item)}
        key={item.track.id}
      >
        <View style={styles.playlistItem}>
          {imageUrl && <Image source={{ uri: imageUrl }} style={styles.songImage} />}
          <View style={styles.playlistTextContainer}>
            <Text style={styles.songName}>{item.track.name}</Text>
            <Text style={styles.artistName}>{artists}</Text>
          </View>

          <TouchableOpacity onPress={() => handleSongOptions(item)}>
            <Ionicons name="ellipsis-vertical-outline" color={"#3a4b53"} size={24} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    )
  }


  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.header}>
        {playlist_info.images[0].url && <Image source={{ uri: playlist_info.images[0].url }} style={styles.playlistImage} />}
        <View style={styles.playlistTextContainer}>
          <Text style={styles.playlistName}>{playlist_info.name}</Text>
          <Text style={styles.playlist_count}>Song count: {playlist_info.tracks.total}</Text>
        </View>
        <TouchableOpacity onPress={handlePlaylistOptions}>
          <Ionicons name="ellipsis-vertical-outline" color={"#3a4b53"} size={40} />
        </TouchableOpacity>
      </View>

      {/* Playlist Control Section */}
      {/*<View style={styles.controlsContainer} >
        <TouchableOpacity onPress={() => {}}>
          <Ionicons name="shuffle-outline" color={"#3a4b53"} size={40} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {}}>
          <Ionicons name="play-circle-outline" color={"#3a4b53"} size={40} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handlePlaylistOptions}>
          <Ionicons name="ellipsis-vertical-outline" color={"#3a4b53"} size={40} />
        </TouchableOpacity>
      </View>*/}

      <View style={{ height: 1, backgroundColor: 'black', marginTop: 10 }} />

      <LinearGradient 
        colors={['#4d646f', '#3a4b53', '#263238', '#1d262a', '#13191c', '#0a0c0e']}
        start={{x: 0.5, y: 0}}
        end={{x: 0.5, y: 0.2 }}
        style={styles.container}
      >
        {tracks.length > 0 ? (
            tracks.map((track) => renderTrackItem({ item: track }))
          ) : (
            <Text style={styles.noPlaylistsText}>No playlists found</Text>
          )
        }
      </LinearGradient>

      <SongOptionsModal
        visible={songOptionsModalVisible}
        onClose={() => set_songOptionsModalVisible(false)}
        track={trackSelect}
      />

      <PlaylistOptionsModal
        visible={playlistOptionsModalVisible}
        onClose={() => set_playlistOptionsModalVisible(false)}
        tracks={tracks}
        playlistInfo={playlist_info}
      />
    </ScrollView>
  )
};


const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    backgroundColor: "#4d646f"
  },
  container: {
    flex: 1,
    padding: 20,
  },
  noPlaylistsText: {
    fontSize: 16,
    color: '#ffffff',
  },
  playlistTextContainer: {
    flex: 1,
  },
  songName: {
    fontSize: 18,
    color: '#ffffff',
  },
  playlistItem: {
    flexDirection: 'row', // Row layout to align image and text horizontally
    alignItems: 'center', // Vertically center the items
    marginBottom: 5,
    padding: 10,
    backgroundColor: 'rgba(46, 59, 67, 0)',
    borderRadius: 10,
  },
  songImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  artistName: {
    fontSize: 14,
    color: '#cccccc',
  },
  playlist_count: {
    fontSize: 14,
    color: '#cccccc',
    paddingLeft: 10
  },

  header: {
    flexDirection: 'row', // Row layout to align image and text horizontally
    alignItems: 'center', // Vertically center the items
    marginBottom: 5,
    padding: 10,
    backgroundColor: '#6a828f',
    borderRadius: 10,
  },
  playlistImage: {
    width: 120,
    height: 120,
    borderRadius: 5,
    marginRight: 10,
  },
  playlistName: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold'
  },

  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',  // Places buttons in a row with space between them
    alignItems: 'center',
    paddingVertical: 20,  // Padding above and below the buttons
    paddingHorizontal: 40,  // Padding on the sides
    backgroundColor: '#4d646f',  // Background for the control section
  },












  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  trackItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  trackName: {
    fontSize: 16,
  },
});

export default PlaylistDetailsScreen;
