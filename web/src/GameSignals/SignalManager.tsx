import {State, Store} from "../Store";
import {AnyProto} from "../generated/ProtobufCommon";
import {SignalHandler, TrackerOrigin} from "./SignalHandler";
import {MutationManager} from "./MutationManager";
import Timeout = NodeJS.Timeout;
import {SignalStore} from "./SignalStore";

export class SignalManager {
    public store: Store<State>;
    public signals: SignalStore;

    private isDisposing: boolean;
    private handle?: SignalHandler = undefined;
    private mutationManager: MutationManager;
    private static timeLimit = 60000; // 60 seconds

    public constructor(store: Store<State>) {
        this.isDisposing = false;
        this.store = store;
        this.mutationManager = new MutationManager();
        this.signals = new SignalStore(this);
    }

    public async Connect(ip: string): Promise<void> {
        if (this.handle)
            await this.handle.Dispose();

        this.handle = new SignalHandler(this, ip, {
            OnSignalReceived: this.signals.SignalReceived,
            OnMutationReceived: this.HandleMutationResponse
        });
        await this.handle.Connect();
    }

    public async DisposeHandle() {
        if (this.isDisposing)
            return;

        this.isDisposing = true;

        await this.handle?.Dispose();
        this.handle = undefined;

        this.isDisposing = false;
    }

    public Dispatch(buff: AnyProto): void {
        if (!this.handle)
            throw new Error("Handle inactive");

        this.handle.SendMessage(buff);
    }

    public Mutation<TRequest extends AnyProto, TResponse extends AnyProto>(buff: TRequest): Promise<TResponse> {
        return new Promise((resolve, reject) => {
            if (!this.handle)
                return reject("Handle inactive");

            const status: {
                cancelled: boolean,
                timer: Timeout | null
            } = {
                cancelled: false,
                timer: null
            }

            status.timer = setTimeout(() => {
                status.cancelled = true;
                reject(new Error("Mutation timed out."));
            }, SignalManager.timeLimit);

            const tracker = this.mutationManager.consumeTracker(data => {
                if (status.cancelled)
                    return;

                clearTimeout(status.timer as any);
                resolve(data);
            });

            this.handle.SendMutation(buff, tracker, TrackerOrigin.Client);
        });
    }

    private HandleMutationResponse(buff: AnyProto, tracker: number, origin: TrackerOrigin) {
        if (origin === TrackerOrigin.Client)
        {
            if (!this.mutationManager.isAvailable(tracker))
                return console.warn(`Received invalid tracker [${tracker}]`);

            this.mutationManager.trackerResponded(tracker, buff);
            return;
        }

        // server response
        this.signals.SignalReceived(buff, tracker);
    }
}

