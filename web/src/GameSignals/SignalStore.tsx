import {SignalManager} from "./SignalManager";
import {AnyProto} from "../generated/ProtobufCommon";
import {SignalAction} from "../types/utils";

export class SignalStore {
    private manager: SignalManager;
    private listeners: Map<Function, Set<SignalAction<any>>>;

    public constructor(manager: SignalManager) {
        this.manager = manager;
        this.listeners = new Map<Function, Set<SignalAction<any>>>();
    }

    // tracker should only be a server tracker
    public SignalReceived(buff: AnyProto, tracker?: number) {
        const isTracked = tracker !== undefined;

        if (!this.listeners.has(buff.constructor))
            return;

        const listeners = this.listeners.get(buff.constructor) as Set<SignalAction<any>>;
        listeners.forEach(listener => this.manager.store.dispatch(listener(buff)(isTracked, this.manager.Dispatch, this.manager.Mutation)));
    }

    public RegisterListeners(listeners: [Function, SignalAction<any>][]) {
        for (const listener of listeners) {
            if (!this.listeners.has(listener[0]))
                this.listeners.set(listener[0], new Set());

            this.listeners.get(listener[0])?.add(listener[1]);
        }
    }

    public UnregisterListeners(listeners: [Function, SignalAction<any>][]) {
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
