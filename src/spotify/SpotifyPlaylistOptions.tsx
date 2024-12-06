import { priorityQueue, defaultQueue } from '../song_queue/QueueManager'

export const shuffleQueue = () => {
    defaultQueue.shuffle();
}

export const mixIn = (newTracks: any) => {
    for (const track of newTracks) {
        defaultQueue.enqueue(track.track.id);
    }
    defaultQueue.shuffle();
    defaultQueue.shuffle();
    defaultQueue.shuffle();
}

