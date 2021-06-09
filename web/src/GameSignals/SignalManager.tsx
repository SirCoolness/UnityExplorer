import {State, Store} from "../Store";
// import {AnyProto} from "../generated/ProtobufCommon";
import {SignalHandler, TrackerOrigin} from "./SignalHandler";
import {MutationManager} from "./MutationManager";
import {SignalStore} from "./SignalStore";
import {RootSignals} from "./Signals";

export class SignalManager {
    public store: Store<State>;
    public signals: SignalStore;
    public handle?: SignalHandler = undefined;

    private isDisposing: boolean;
    private mutationManager: MutationManager;
    private static timeLimit = 60000; // 60 seconds

    public constructor(store: Store<State>) {
        this.isDisposing = false;
        this.store = store;
        this.mutationManager = new MutationManager();
        this.signals = new SignalStore(this);

        for (const sigMap of RootSignals) {
            this.signals.RegisterListeners(sigMap);
        }
    }

    public Connect: (ip: string) => Promise<void> = async ip => {
        if (this.handle)
            await this.handle.Dispose();

        this.handle = new SignalHandler(this, ip, {
            OnSignalReceived: this.signals.SignalReceived,
            OnMutationReceived: this.HandleMutationResponse
        });
        await this.handle.Connect();
    }

    public DisposeHandle: () => Promise<void> = async () => {
        if (this.isDisposing)
            return;

        this.isDisposing = true;

        await this.handle?.Dispose();
        this.handle = undefined;

        this.isDisposing = false;
    }

    public Dispatch: (buff: any) => void = buff => {
        if (!this.handle)
            throw new Error("Handle inactive");

        this.handle.SendMessage(buff);
    }

    public Mutation: <TRequest extends any, TResponse extends any>(buff: TRequest) => Promise<TResponse> = async buff => {
        return new Promise((resolve, reject) => {
            if (!this.handle)
                return reject("Handle inactive");

            const status: {
                cancelled: boolean,
                timer: NodeJS.Timeout | null
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

    private HandleMutationResponse: (buff: any, tracker: number, origin: TrackerOrigin) => void = (buff, tracker, origin) => {
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

