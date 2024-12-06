import { priorityQueue, defaultQueue } from "../song_queue/QueueManager";
import { getDevice } from "./SpotifyPlayback";

// Spotify API Bse URL
const SPOTIFY_API_BASE_URL = 'https://api.spotify.com/v1';



export const fetchAllUserPlaylists = async (accessToken: string): Promise<any[]> => {
    const playlists: any[] = [];
    let nextUrl: string | null = `${SPOTIFY_API_BASE_URL}/me/playlists`;

    try {
        while (nextUrl) {
            const response: Response = await fetch(nextUrl, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Error fetching playlists: ${response.status}`);
            }

            const data: {
                items: any[];
                next: string | null;
            } = await response.json();

            playlists.push(...data.items);
            nextUrl = data.next; // Spotify API provides the URL for the next page of results
        }

        return playlists.filter((playlist) => playlist);
    } catch (error) {
        console.error('Error fetching Spotify playlists:', error);
        return [];
    }
};


export const fetchAllPlaylistTracks = async (href: string, accessToken: string) => {
    const allTracks: any[] = []; // Initialize an array to hold all tracks
    let nextUrl = href; // Start with the provided href
  
    try {
        while (nextUrl) {
            const response = await fetch(nextUrl, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
  
            if (!response.ok) {
                throw new Error(`Error fetching playlist tracks: ${response.status}`);
            }
  
            const data = await response.json();
            allTracks.push(...data.items); // Add the current page's tracks to the array
            nextUrl = data.next; // Set nextUrl to the next page URL (or null if there are no more pages)
        }
  
        return allTracks; // Return the combined list of all tracks
    } catch (error) {
        console.error('Error fetching Spotify playlist tracks:', error);
        throw error; // Optionally re-throw the error for further handling
    }
  };
  


/**
 * Fetches and prints the list of available Spotify devices
 * 
 * @param {string} accessToken - Spotify access token to authenticate the request.
 * @returns {Promise<void>} - A Promise that resolves when the devices are fetched and logged.
 */
export const fetchAvailableDevices = async (accessToken: string): Promise<void> => {
    try {
        const response = await fetch(`${SPOTIFY_API_BASE_URL}/me/player/devices`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json(); // Capture error response
            console.error(`Error fetching devices: ${response.status}`, errorData);
            throw new Error(`Error fetching devices: ${response.status}`);
        }

        const data = await response.json();
        const devices = data.devices;

        // Log the available devices
        if (devices && devices.length > 0) {
            console.log('Available devices:');
            devices.forEach((device: any) => {
                console.log(`Device Name: ${device.name}, Device ID: ${device.id}, Type: ${device.type}`);
            });
        } else {
            console.log('No devices available.');
        }
    } catch (error) {
        console.error('Error fetching available Spotify devices:', error);
    }
};


