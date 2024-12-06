import MainQueue from './Queue';

// Create a shared instance of MainQueue
export const defaultQueue = new MainQueue();
export const priorityQueue = new MainQueue();

let current: 'default' | 'priority' = 'default';
export const setCurrent = (queue: 'default' | 'priority') => {
    current = queue;
}

export const getCurrent = () => {
    return current;
}
