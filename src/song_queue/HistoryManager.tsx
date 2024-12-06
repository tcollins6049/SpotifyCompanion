/**
 * Manages the previously played songs. Used for the skip back button.
 */
class HistoryManager {
    private history: string[] = [];

    // Add song to history
    addToHistory(item: string) {
        this.history.push(item);
    }

    // Remove song from history
    removeFromHistory(): string | undefined {
        return this.history.pop();
    }

    // Get most recent song without removing
    getLastPlayed(): string | undefined {
        return this.history[this.history.length - 1];
    }

    // Get history
    getHistory() {
        return this.history;
    }

    // Print history
    print() {
        console.log('History', this.history);
    }
}

const historyManager = new HistoryManager();
export default historyManager;
