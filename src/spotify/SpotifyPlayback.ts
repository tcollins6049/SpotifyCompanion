import axios from 'axios';
import { defaultQueue, priorityQueue, getCurrent, setCurrent } from '../song_queue/QueueManager';
import { updatePlaybackState } from '../song_queue/PlaybackState';
import history from '../song_queue/HistoryManager';


/**
 * Function to play track using Spotify Web API (this assumes you have Spotify Premium)
 * 
 * @param accessToken 
 * @param songId 
 */
export const playTrack = async (accessToken: string, songId: string) => {
  // const device_id = 'f8ef47e18e482dac62b570830070fbabf1a8295b';  // Device ID where playback will happen
  const songUri = `spotify:track:${songId}`;  // Spotify URI format for tracks
  
  try {
    const device_id = await getDevice(accessToken);

    await axios.put(
      `https://api.spotify.com/v1/me/player/play?device_id=${device_id}`,
      {
        uris: [songUri],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log('Playback started');
  } catch (error) {
    console.error('Error playing track:', error);
  }
};


/**
 * Calls endpoint to pause currently playing track in Spotify
 * 
 * @param accessToken Needed for authorization
 */
export const pauseTrack = async (accessToken: string) => {
  // const device_id = 'f8ef47e18e482dac62b570830070fbabf1a8295b'; // Device ID where playback is happening
  
  try {
    const device_id = await getDevice(accessToken);

    await axios.put(
      `https://api.spotify.com/v1/me/player/pause?device_id=${device_id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log('Playback paused');
  } catch (error) {
    console.error('Error pausing track:', error);
  }
};


/**
 * Used to resume currently playing track.
 * 
 * @param accessToken Needed for authorization
 */
export const resumeTrack = async (accessToken: string) => {
  // const device_id = 'f8ef47e18e482dac62b570830070fbabf1a8295b'; // Device ID where playback is happening
  
  try {
    const device_id = await getDevice(accessToken);

    await axios.put(
      `https://api.spotify.com/v1/me/player/play?device_id=${device_id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log('Playback resumed');
  } catch (error) {
    console.error('Error resuming track:', error);
  }
};


export const skipTrack = async (accessToken: string) => {
  // const device_id = 'f8ef47e18e482dac62b570830070fbabf1a8295b'; // Device ID where playback is happening
  try {
    const device_id = await getDevice(accessToken);

    // Send a PUT request to skip the track
    await axios.post(
      `https://api.spotify.com/v1/me/player/next?device_id=${device_id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log('Track skipped');
  } catch (error) {
    console.error('Error skipping track:', error);
  }
};


export const skipBack = async (accessToken: string) => {
  // const device_id = 'f8ef47e18e482dac62b570830070fbabf1a8295b'; // Device ID where playback is happening

  try {
    const device_id = await getDevice(accessToken);

    // Send a POST request to skip to the previous track
    await axios.post(
      `https://api.spotify.com/v1/me/player/previous?device_id=${device_id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log('Skipped to previous track');
  } catch (error) {
    console.error('Error skipping back to previous track:', error);
  }
};


/**
 * Function to get data for a track given that tracks spotify track ID.
 * 
 * @param accessToken 
 * @param songId 
 */
export const getTrackName = async (accessToken: string, songId: string) => {
  try {
    const response = await axios.get(`https://api.spotify.com/v1/tracks/${songId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const trackData = response.data;
    // console.log(trackData);
    return trackData.name;
  } catch (error) {
    console.log(`Error getting track details:`, error);
    return null;
  }
}


export const getTrackDetails = async (accessToken: string, songId: string) => {
  try {
    const response = await axios.get(`https://api.spotify.com/v1/tracks/${songId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const trackData = response.data;
    return trackData;
  } catch (error) {
    console.log(`Error getting track details:`, error);
    return null;
  }
}


export const getDevice = async (accessToken: string) => {
  const devicesResponse = await axios.get('https://api.spotify.com/v1/me/player/devices', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // Find the first active device (you can change this logic to select a specific device if needed)
  const activeDevice = devicesResponse.data.devices.find((device: any) => device.is_active);

  if (!activeDevice) {
    console.error('No active device found');
    return;
  }

  const device_id = activeDevice.id; // Get the device ID from the active device

  return device_id;
}


export const isTrackPlaying = async (accessToken: string) => {
  try {
    const response = await axios.get('https://api.spotify.com/v1/me/player', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Check if there is a currently playing track
    if (response.data.is_playing) {
      return true; // Track is playing
    } else {
      return false; // Track is not playing
    }
  } catch (error) {
    console.error('Error checking playback state:', error);
    return false; // Consider track not playing if there's an error
  }
};


export const getCurrentTrack = async (accessToken: string) => {
  try {
    // Send a GET request to the currently-playing endpoint
    const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Check if there's a currently playing track
    if (response.data && response.data.item) {
      return response.data.item; // Return all the song info
    } else {
      console.log('No track is currently playing');
      return null; // No track is playing
    }
  } catch (error) {
    console.error('Error fetching current track:', error);
    return null; // Return null if there’s an error
  }
};


export const addToQueue = async (accessToken: string, queue: string[]) => {
  try {
    const device_id = await getDevice(accessToken);

    // Iterate through the queue and add each song to the Spotify queue
    for (const songId of queue) {
      const songUri = `spotify:track:${songId}`; // Spotify URI format for tracks
      await axios.post(
        `https://api.spotify.com/v1/me/player/queue?uri=${songUri}&device_id=${device_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(`Added song ${songId} to queue`);
    }
  } catch (error) {
    console.error('Error adding songs to queue:', error);
  }
};

