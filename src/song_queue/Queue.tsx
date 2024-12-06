import historyManager from './HistoryManager';

/**
 * Queue data structure. Contains queue and methods needed to interact with queue.
 */
export default class MainQueue {
    private queue: string[];


    constructor() {
        this.queue = [];
    }

    // Add song to end of queue
    enqueue(song: string) {
        this.queue.push(song);
    }

    // Add a song to the front of the queue (Play next)
    enqueueFront(song: string) {
        this.queue.unshift(song);
    }

    // Remove a song from the front (Play the next song)
    dequeue() {
        const currentSong = this.queue.shift();
        if (currentSong) {
            historyManager.addToHistory(currentSong);
        }
        // return currentSong;
    }

    // Peek at the front song without removing
    peek(): string | undefined {
        return this.queue[0];
    }

    // Peek at second song in queue
    peekNext(): string | undefined {
        return this.queue[1]; // Returns second thing in queue
    }

    // Get the current queue
    getQueue(): string[] {
        return this.queue;
    }

    setQueue(newQueue: any) {
        this.queue = newQueue;
    }

    // Remove a specific song from queue
    remove(song: string) {
        this.queue = this.queue.filter(item => item !== song);
    }

    // Check if the queue is empty
    isEmpty(): boolean {
        return this.queue.length === 0;
    }

    // Clear the queue
    clear() {
        this.queue = [];
    }

    // Shuffle the queue
    shuffle() {
        for (let i = this.queue.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.queue[i], this.queue[j]] = [this.queue[j], this.queue[i]];
        }
    }

    // Shuffle the queue except for the first song
    shuffleExceptFirst() {
        if (this.queue.length <= 1) return; // Nothing to shuffle

        const firstSong = this.queue[0];
        const remainingSongs = this.queue.slice(1);

        // Shuffle remaining songs
        for (let i = remainingSongs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [remainingSongs[i], remainingSongs[j]] = [remainingSongs[j], remainingSongs[i]];
        }

        // Reconstruct queue with original first song at front
        this.queue = [firstSong, ...remainingSongs];
    }


    getLength(): number {
        return this.queue.length;
    }

    // Print queue
    print() {
        console.log("Queue contents:", this.queue);
    }


    getElement(index: number) {
        return this.queue[index];
    }
}
