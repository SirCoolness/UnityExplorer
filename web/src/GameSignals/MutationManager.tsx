type TrackerMap = {};

export class MutationManager {
    private lastTracker: number;
    private activeTrackers: Record<number, (data: any) => void>;

    public constructor() {
        this.lastTracker = 0;
        this.activeTrackers = {};
    }

    public consumeTracker(callback: (data: any) => void): number
    {
        this.activeTrackers[++this.lastTracker] = callback;
        return this.lastTracker;
    }

    public trackerResponded(tracker: number, data: any)
    {
        this.activeTrackers[tracker](data);
        delete this.activeTrackers[tracker];
    }

    public isAvailable(tracker: number)
    {
        return this.activeTrackers.hasOwnProperty.call(this.activeTrackers.hasOwnProperty, tracker);
    }
}
