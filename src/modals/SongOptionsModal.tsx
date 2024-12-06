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
import { addSongToQueue, playNext } from '../spotify/SpotifySongOptions';


interface OptionsModalProps {
  visible: boolean;
  onClose: () => void;
  track: any;
}

const SongOptionsModal: React.FC<OptionsModalProps> = ({ visible, onClose, track }) => {
  const trackImageUrl = track?.track?.album?.images?.[0]?.url || track?.album?.images?.[0]?.url || null;
  const trackName = track?.track?.name || track?.name || 'Unknown Track';
  const artistName = track?.track?.artists?.[0]?.name || track?.artists?.[0]?.name || 'Unknown Artist';

  // console.log(track.name);

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
            {/* Track Header Section */}
          <View style={styles.trackHeader}>
            {trackImageUrl ? (
                <Image source={{ uri: trackImageUrl }} style={styles.trackImage} />
              ) : (
                <View style={styles.placeholderImage} />
              )}
              <View style={styles.trackInfo}>
                <Text style={styles.trackName}>{trackName}</Text>
                <Text style={styles.artistName}>{artistName}</Text>
              </View>
            </View>


            <TouchableOpacity onPress={() => addSongToQueue(track)} style={styles.optionButton}>
                <Text style={styles.optionText}>Add to Queue</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => playNext(track)} style={styles.optionButton}>
                <Text style={styles.optionText}>Play Next</Text>
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

  trackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20, // Space between header and options
  },
  trackImage: {
    width: 50,
    height: 50, // Square image
    marginRight: 10, // Space between the image and text
  },
  placeholderImage: {
    width: 50,
    height: 50,
    backgroundColor: '#ccc',
    marginRight: 10, // Space between the image and text
  },
  trackInfo: {
    flexDirection: 'column',
  },
  trackName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  artistName: {
    fontSize: 14,
    color: '#888', // Lighter color for the artist name
  },
});


export default SongOptionsModal;
