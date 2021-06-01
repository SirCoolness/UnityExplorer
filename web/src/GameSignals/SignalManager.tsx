import {State, Store} from "../Store";
import {AnyProto} from "../generated/ProtobufCommon";
import {SignalHandler, TrackerOrigin} from "./SignalHandler";
import {MutationManager} from "./MutationManager";

export class SignalManager {
    private isDisposing: boolean;

    public store: Store<State>;
    private handle?: SignalHandler = undefined;
    private mutationManager: MutationManager;

    public constructor(store: Store<State>) {
        this.isDisposing = false;
        this.store = store;
        this.mutationManager = new MutationManager();
    }

    public async Connect(ip: string): Promise<void> {
        if (this.handle)
            await this.handle.Dispose();

        this.handle = new SignalHandler(this, ip, {
            OnSignalReceived: this.HandleSignal,
            OnMutationReceived: this.HandleMutationResponse
        });
        await this.handle.Connect();
    }

    public async DisposeHandle()
    {
        if (this.isDisposing)
            return;

        this.isDisposing = true;

        await this.handle?.Dispose();
        this.handle = undefined;

        this.isDisposing = false;
    }

    public Dispatch(buff: AnyProto): void {

    }

    public async Mutation<TRequest extends AnyProto, TResponse extends AnyProto>(buff: TRequest): Promise<TResponse> {
        const tracker = this.mutationManager.consumeTracker();
    }

    private HandleMutationResponse(buff: AnyProto, tracker: number, origin: TrackerOrigin) {

    }

    private HandleSignal(buff: AnyProto) {

    }
}

