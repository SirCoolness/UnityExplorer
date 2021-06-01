type TrackerMap = {};

export class MutationManager {
    private lastTracker: number;
    private activeTrackers: Set<number>;

    public constructor() {
        this.lastTracker = 0;
        this.activeTrackers = new Set<number>();
    }

    public consumeTracker(): number
    {
        this.activeTrackers.add(++this.lastTracker);
        return this.lastTracker;
    }

    public trackerResponded(tracker: number)
    {
        this.activeTrackers.delete(tracker);
    }
}
