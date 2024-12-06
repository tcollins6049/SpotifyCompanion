import { defaultQueue, priorityQueue, setCurrent } from './QueueManager';


class QueueService {
    /**
     * Occurs when a user selects a song within a playlist.
     * Adds selected song to front of queue, shuffles remaining songs, then adds them to queue
     * 
     * @param selectedTrack 
     * @param allTracks 
     */
    static queueTrackAndPlaylist(selectedTrack: any, allTracks: any[]) {
        // Clear the current queue
        defaultQueue.clear();
        priorityQueue.clear();

        // Add the selected track to the front of the queue
        defaultQueue.enqueue(selectedTrack.track.id);

        // Track will play from the default queue
        setCurrent('default');

        // Add all tracks to the queue
        allTracks.forEach(track => {
            if (track !== selectedTrack) {
                defaultQueue.enqueue(track.track.id);
            }
        })

        defaultQueue.shuffleExceptFirst();    // Shuffle queue except first song
    }
}


export default QueueService;
