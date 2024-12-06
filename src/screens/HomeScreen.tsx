import React, { useEffect, useCallback, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Animated, StyleSheet } from 'react-native';
import Video from 'react-native-video';
import LottieView from 'lottie-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import QueueModal from '../modals/QueueModal';

// import { startPlaybackMonitor } from '../spotify/SpotifyPlayback';
import { useSpotifyAuth } from '../context/SpotifyAuthContext';
import { getCurrName, getCurrArtist, getCurrId, updatePlaybackState } from '../song_queue/PlaybackState';
import { getCurrentTrack } from '../spotify/SpotifyPlayback';
import SongOptionsModal from '../modals/SongOptionsModal';
import { 
  playTrack, 
  // checkPlaybackStatus,
  resumeTrack, 
  pauseTrack, 
  skipTrack, 
  getTrackName, 
  getTrackDetails, 
  isTrackPlaying,
  skipBack
} from '../spotify/SpotifyPlayback';


const { width, height } = Dimensions.get('window'); // Added
const squareSize = width * 0.8;

/**
 * 
 * @returns 
 */
const HomeScreen = () => {
  // const [modalVisible, setModalVisible] = useState(false);

  const { accessToken } = useSpotifyAuth();
  const [currName, set_currName] = useState<any>("");
  const [currArtist, set_currArtist] = useState<any>("");
  const [currSongData, set_currSongData] = useState<any>("");
  const [currentVideo, set_currentVideo] = useState<any>(require('../../assets/jake.mp4'));

  const [isPlaying, set_isPlaying] = useState<boolean>(false);
  const [isPlayerActive, set_isPlayerActive] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);

  const [songOptionsModalVisible, set_songOptionsModalVisible] = useState<boolean>(false);
  const [queueModalVisible, set_queueModalVisible] = useState<boolean>(false);

  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null); // Current song's ID
  const [songCount, setSongCount] = useState<number>(0); // Counter for songs played
  const updateSongInfo = async () => {
    // Use Spotify API to get info on currently playing song
    if (accessToken) {
      const songData = await getCurrentTrack(accessToken);
      if (songData) {
        set_currName(songData.name);
        set_currArtist(songData.artists[0].name);
        set_currSongData(songData);
        set_isPlayerActive(true);
        const playing = await isTrackPlaying(accessToken);
        set_isPlaying(playing);
      }

      /*await checkForSongChange();
      console.log(songCount)
      if (songCount > 4) {
        await selectRandVideo();
        console.log(songCount)
        setSongCount(0);
      }*/
    }
  }

  let i = 0;
  const checkForSongChange = async () => {
      if (accessToken) {
        const currentTrack = await getCurrentTrack(accessToken);
        console.log(currentTrack);
        if (currentTrack) {
          const newTrackId = currentTrack.id;

          // Check if the track ID has changed
          if (currentTrackId !== newTrackId) {
            setCurrentTrackId(newTrackId); // Update the current track ID
            setSongCount((prevCount) => prevCount + 1); // Increment the song counter
          }
        }
      }
  };


  useEffect(() => {
    if (accessToken) {
      checkPlay().then(() => setLoading(false));
    }
  }, [accessToken]);

  useEffect(() => {
    if (loading) return;

    const songInterval = setInterval(updateSongInfo, 1000);
    const videoInterval = setInterval(selectRandVideo, 20000);

    return () => {
      clearInterval(songInterval);
      clearInterval(videoInterval);
    }
  }, [loading, accessToken]);

  const checkPlay = async () => {
    if (accessToken) {
      const playing = await isTrackPlaying(accessToken);
      await updateSongInfo();

      console.log("Current Track Name: ", currName);

      set_isPlaying(playing)

      console.log(playing);
      set_isPlayerActive(playing || currName !== "");
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      checkPlay();
    }, [accessToken])
  )


  const handleSkip = async () => {
    if (accessToken) {
      await skipTrack(accessToken);
      set_isPlaying(true);
    }
  }


  const handlePlay = async () => {
    if (accessToken) {
      await resumeTrack(accessToken);
      set_isPlaying(true);
    }
  };


  const handlePause = async () => {
    if (accessToken) {
        await pauseTrack(accessToken);
        set_isPlaying(false);
    }
  };


  const handleBack = async () => {
    if (accessToken) {
      await skipBack(accessToken);
      set_isPlaying(true);
    }
  }


  const videoList: Record<string, any> = {
    video1: require('../../assets/patrick_vibin_trim.mp4'),
    video2: require('../../assets/jake.mp4')
  }
  let j = 0;
  const selectRandVideo = async () => {
    if (j === 0) {
      j = 1;
      const videoKeys = Object.keys(videoList);
      const randomIndex = Math.floor(Math.random() * videoKeys.length);
      const randomKey = videoKeys[randomIndex];
      set_currentVideo(videoList[randomKey]);
      j = 0
    }
  }


  return (
    <View style={styles.modalBackground}>
        <LottieBackground />

        {/* Reorder Icon at top right */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => set_queueModalVisible(true)} style={styles.iconSpacing} >
            <Ionicons name="reorder-three" color="#fff" size={30} />
          </TouchableOpacity>
        
          <TouchableOpacity onPress={() => set_songOptionsModalVisible(true)} style={styles.iconSpacing} >
            <Ionicons name="ellipsis-vertical" color="#fff" size={30} />
          </TouchableOpacity>
        </View>

        <View style={styles.videoContainer}>
            <Video
                source={currentVideo} // Replace with the video link you want to loop
                style={styles.video}
                resizeMode={"cover"}
                repeat
                muted={true}
                paused={false}
                controls={false}
                disableFocus={true}
                playInBackground={false}
                playWhenInactive={false}
                ignoreSilentSwitch="ignore"
                onError={(error) => console.log("video playback error:", error)}
            />
        </View>

        {isPlayerActive && (
            <View>
                <Text style={styles.songTextCurrent}>{currName}</Text>
                <Text style={styles.artistTextCurrent}>{currArtist}</Text>
            </View>
        )}

        {isPlayerActive && (
          <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={handleBack}>
                  <Ionicons name="play-skip-back-sharp" color={"#fff"} size={35} />
              </TouchableOpacity>

              <TouchableOpacity onPress={isPlaying ? handlePause : handlePlay}>
                  <Ionicons name={isPlaying ? "pause-circle" : "play-circle"} color={"#fff"} size={70} />
              </TouchableOpacity>
              
              <TouchableOpacity onPress={handleSkip}>
                  <Ionicons name="play-skip-forward-sharp" color={"#fff"} size={35} />
              </TouchableOpacity>
          </View>
        )}

        <SongOptionsModal
          visible={songOptionsModalVisible}
          onClose={() => set_songOptionsModalVisible(false)}
          track={currSongData}
        />

        <QueueModal
          visible={queueModalVisible}
          onClose={() => set_queueModalVisible(false)}
          accessToken={accessToken}
        />
    </View>
  );
};


const LottieBackground = () => { 
  return ( 
    <LottieView 
      source={require('../../assets/Animation_3.json')} // Adjust the path as needed 
      autoPlay 
      loop 
      speed={0.5}
      style={styles.lottie} 
      resizeMode="cover"
    /> 
  ); 
};


const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1d262a',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',  // Aligns icons to the right
    alignItems: 'center',
    position: 'absolute',         // Position it at the top right of the screen
    top: 60,                      // Adjust this value to move it vertically
    right: 30,                    // Adjust this value to move it horizontally
    zIndex: 1,                    // Ensure it sits on top of other elements
  },
  reorderIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1, // Ensure the icon is above other components
  },
  iconSpacing: {
    marginHorizontal: 10,
  },
  closeButton: {
    marginTop: 20,
  },
  closeButtonText: {
    color: '#007bff',
    fontSize: 18,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoContainer: {
    width: squareSize,
    height: squareSize * 1.05,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },

  carouselContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  songText: {
    fontSize: 18,
    color: '#888',
    opacity: 0.6,
  },
  songTextCurrent: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginVertical: 10,
  },
  artistTextCurrent: {
    fontSize: 18, // Adjust as needed
    color: '#cccccc', // A lighter color for the artist name
  },

  lottie: { 
    position: 'absolute', 
    width: width, 
    height: height, 
    zIndex: -1, 
  },

  playButton: {
    marginHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: 'row',  // Align buttons horizontally
    justifyContent: 'space-between', // Distribute space between buttons
    alignItems: 'center',  // Vertically align items
    width: '60%',          // Limit the width of the button container
    alignSelf: 'center',   // Center the button container
    marginVertical: 20,    // Add some space above and below
  },
});


export default HomeScreen;
