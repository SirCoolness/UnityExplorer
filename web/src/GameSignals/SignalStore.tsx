import {SignalManager} from "./SignalManager";
import {AnyProto} from "../generated/ProtobufCommon";
import {SignalAction} from "../types/utils";
import {TrackerOrigin} from "./SignalHandler";

export type SignalMap = [Function, SignalAction<any, any>][];

export class SignalStore {
    private manager: SignalManager;
    private listeners: Map<Function, Set<SignalAction<any, any>>>;

    public constructor(manager: SignalManager) {
        this.manager = manager;
        this.listeners = new Map<Function, Set<SignalAction<any, any>>>();
    }

    // tracker should only be a server tracker
    public SignalReceived(buff: AnyProto, tracker?: number) {
        const isTracked = tracker !== undefined;

        if (!this.listeners.has(buff.constructor))
            return;

        const listeners = this.listeners.get(buff.constructor) as Set<SignalAction<any>>;
        listeners.forEach(listener => {
            const res = this.manager.store.dispatch(listener(buff)(isTracked, this.manager.Dispatch, this.manager.Mutation));
            if (isTracked)
                res.then(data => {
                    if (!this.manager.handle)
                        throw new Error("Missing handle");

                    this.manager.handle.SendMutation((data as unknown) as AnyProto, (tracker as unknown) as number, TrackerOrigin.Server);
                })
        });
    }

    public RegisterListeners(listeners: SignalMap) {
        for (const listener of listeners) {
            if (!this.listeners.has(listener[0]))
                this.listeners.set(listener[0], new Set());

            this.listeners.get(listener[0])?.add(listener[1]);
        }
    }

    public UnregisterListeners(listeners: SignalMap) {
        for (const listener of listeners) {
            if (!this.listeners.has(listener[0]))
                continue;

            const l = this.listeners.get(listener[0]);
            if (!l?.has(listener[1]))
                continue;

            l.delete(listener[1]);
        }
    }
}
