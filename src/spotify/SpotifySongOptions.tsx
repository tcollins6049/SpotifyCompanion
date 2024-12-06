import { priorityQueue } from '../song_queue/QueueManager';

export const addSongToQueue = (track: any) => {
    priorityQueue.enqueue(track.track.id);
    console.log(`${track.track.name} was added to priority queue`);
}


export const playNext = (track: any) => {
    priorityQueue.enqueueFront(track.track.id);
    console.log(`${track.track.name} will be played next`);
}
