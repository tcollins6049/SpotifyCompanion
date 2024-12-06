import { defaultQueue, priorityQueue, getCurrent } from './QueueManager';


let currentSongName = "";
let currentSongArtist = "";
let currentSongId = "";

export const getPlaybackState = () => ({
    currentSongName,
    currentSongArtist
});

export const getCurrName = () => currentSongName;

export const getCurrArtist = () => currentSongArtist;

export const getCurrId = () => currentSongId;

export const updatePlaybackState = (name: string, artist: string, id: string) => {
    currentSongName = name;
    currentSongArtist = artist;
    currentSongId = id;
};
