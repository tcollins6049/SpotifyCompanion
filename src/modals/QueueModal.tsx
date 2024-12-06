import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { defaultQueue, priorityQueue } from '../song_queue/QueueManager';
import { getTrackDetails, addToQueue } from '../spotify/SpotifyPlayback';


interface QueueModalProps {
  visible: boolean;
  onClose: () => void;
  accessToken: any
}

const QueueModal: React.FC<QueueModalProps> = ({ visible, onClose, accessToken }) => {
    // const [queue, setQueue] = useState<any[]>([]);
    const [tracks, setTracks] = useState<any[]>([]);

    useEffect(() => {
        if (visible) {
        // Fetch the queue when the modal is visible
        const fetchQueue = async () => {
            const queueData = [...priorityQueue.getQueue(), ...defaultQueue.getQueue()]; // Fetch queue from your method
            // setQueue(queueData.slice(0, 100)); // Get the first 100 items

            const trackDetails = await Promise.all(
                queueData.slice(0, 20).map((item) => getTrackDetails(accessToken, item))
            );
            setTracks(trackDetails);
        };

        fetchQueue();
        }
    }, [visible]); // Re-fetch when modal visibility changes


    const handleRemove = async (song: any) => {
        // Remove the song from the queue
        defaultQueue.remove(song.id);

        const updatedQueue = await defaultQueue.getQueue();

        const trackDetails = await Promise.all(
            updatedQueue.slice(0, 20).map((item) => getTrackDetails(accessToken, item))
        );

        setTracks(trackDetails);
    };


    const renderQueueItem = ({ item, index }: { item: any, index: number }) => {
        const track = item; // Access the track details for the current item
        
        if (!track) {
            return (
                <View style={styles.queueItem}>
                    <Text>Loading...</Text>
                </View>
            );
        }

        return (
            <View style={styles.queueItem}>
                {/* Remove button */}
                <TouchableOpacity style={styles.removeButton} onPress={() => handleRemove(item)}>
                    <Ionicons name="remove-circle-outline" size={24} color="#1DB954" />
                </TouchableOpacity>

                {/* Track details */}
                <View style={styles.trackInfo}>
                    <Text style={styles.trackName}>{track.name}</Text>
                    <Text style={styles.artistName}>{track.artists[0]?.name}</Text>
                </View>
            </View>
        );
    }


    const handleQueueLock = async () => {
      await addToQueue(accessToken, priorityQueue.getQueue())
      await addToQueue(accessToken, defaultQueue.getQueue())
      priorityQueue.clear();
      defaultQueue.clear();
      setTracks([]);
    }


    return (
        <Modal transparent={true} visible={visible} animationType="slide">
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <View style={styles.topSection}>
                <Text style={styles.modalTitle}>Playlist Options</Text>
              </View>

              {/* Lock Queue Option */}
              <TouchableOpacity style={styles.lockQueueButton} onPress={handleQueueLock}>
                <Ionicons name="lock-closed-outline" size={24} color="#1DB954" />
                <Text style={styles.lockQueueText}>Lock Queue</Text>
              </TouchableOpacity>
            
              <FlatList
                  data={tracks}
                  renderItem={renderQueueItem}
                  keyExtractor={(item, index) => index.toString()}
                  style={styles.queueList}
              />

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
    backgroundColor: '#121212',
    height: '80%', // Adjust the height as needed
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  topSection: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: "#1DB954"
  },
  lockQueueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
  },
  lockQueueText: {
    fontSize: 18,
    marginLeft: 10,
    color: 'white',
  },
  queueList: {
    flex: 1,
    marginBottom: 20,
  },
  queueItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center'
  },
  removeButton: {
    marginRight: 15,
  },
  trackInfo: {
    flex: 1,
  },
  trackName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white'
  },
  artistName: {
    fontSize: 14,
    color: '#888',
  },
  closeButton: {
    padding: 15,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: 'blue',
  },
});

export default QueueModal;
