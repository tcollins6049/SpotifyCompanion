import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
  Image
} from 'react-native';
import { mixIn } from '../spotify/SpotifyPlaylistOptions';


interface OptionsModalProps {
  visible: boolean;
  onClose: () => void;
  tracks: any;
  playlistInfo: any
}

const PlaylistOptionsModal: React.FC<OptionsModalProps> = ({ visible, onClose, tracks, playlistInfo }) => {
  const imageUrl = playlistInfo.images && playlistInfo.images.length > 0 ? playlistInfo.images[0].url : null;

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
            {/* Playlist Header Section */}
            <View style={styles.playlistHeader}>
              {imageUrl && <Image source={{ uri: imageUrl }} style={styles.playlistImage} />}
              <View style={styles.playlistInfo}>
                <Text style={styles.playlistName}>{playlistInfo.name}</Text>
                <Text style={styles.songCount}>Song count: {playlistInfo.tracks.total}</Text>
              </View>
            </View>


            <TouchableOpacity onPress={() => mixIn(tracks)} style={styles.optionButton}>
                <Text style={styles.optionText}>Mix In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#B0B0B0',
    height: '50%', // Take half the screen
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  optionButton: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionText: {
    fontSize: 18,
  },
  closeButton: {
    padding: 15,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: 'blue',
  },

  playlistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20, // Space between header and options
  },
  playlistImage: {
    width: 50,
    height: 50,
    marginRight: 10, // Space between the image and text
  },
  playlistInfo: {
    flexDirection: 'column',
  },
  playlistName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  songCount: {
    fontSize: 14,
    color: '#888', // Lighter color for the song count
  },
});


export default PlaylistOptionsModal;
