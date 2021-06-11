import {core} from "../../generated/Buffs";
import {Message} from "protobufjs";

type Binding = (headers: core.IHeaders, buff?: Message) => void;

export class RPCTracker {
    private Trackers: Record<number, Binding> = {};
    private TrackerINC: number = Number.MIN_SAFE_INTEGER;

    public OnTrackerResponse: (headers: Message & core.IHeaders, buff?: Message) => void = (headers, buff) => {
        const cb = this.Trackers[(headers.RPC as core.IRPCDetails).Tracker as number];
        delete this.Trackers[(headers.RPC as core.IRPCDetails).Tracker as number];
        cb(headers, buff);
    }

    public AddTrackedCallback: (callback: Binding) => number = callback => {
        const tracker = this.TrackerINC++;
        this.Trackers[tracker] = callback;
        return tracker;
    }
}

