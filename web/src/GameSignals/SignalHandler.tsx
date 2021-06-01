import {SignalManager} from "./SignalManager";
import {Dispatch} from "../types/utils";
import {TryConnecting} from "../Store/Modules/GameConnection/AsyncActions";
import {State} from "../Store";
import {AnyProto, Protomap} from "../generated/ProtobufCommon";
import {Reader, Writer} from "protobufjs";
import {Debug} from "./Debug";

// only 2 allowed, since using bool
export enum TrackerOrigin {
    Client,
    Server
}

interface Handlers {
    OnMutationReceived: (buff: AnyProto, tracker: number, origin: TrackerOrigin) => void,
    OnSignalReceived: (buff: AnyProto) => void
}

export class SignalHandler implements Handlers {
    private isDisposing: boolean;

    private manager: SignalManager;
    private dispatch: Dispatch;
    private getState: () => State;
    private ip: string;
    private ws?: WebSocket;

    public constructor(manager: SignalManager, ip: string, handlers?: Handlers) {
        this.isDisposing = false;

        this.manager = manager;
        this.ip = ip;
        this.dispatch = manager.store.dispatch;
        this.getState = manager.store.getState;

        if (handlers)
            for (const key of Object.keys(handlers))
                //@ts-ignore
                this[key] = handlers[key];
    }

    public async Connect() {
        await this.dispatch(TryConnecting(this.ip));

        const state = this.getState();
        if (!state.GameConnection.connected)
            return;

        this.ws = state.GameConnection.socket;
        this.ws?.addEventListener("message", this.OnMessage);
    }

    public async Dispose() {
        if (this.isDisposing)
            return;

        const state = this.getState();

        if (!state.GameConnection.connected)
            return;

        this.isDisposing = true;
        state.GameConnection.socket?.removeEventListener("message", this.OnMessage);
        state.GameConnection.socket?.close(1000);

        await this.manager.DisposeHandle();
    }

    public SendMessage(buff: AnyProto)
    {
        this.Internal_SendMessage(buff);
    }

    public SendMutation(buff: AnyProto, tracker: number, origin: TrackerOrigin)
    {
        this.Internal_SendMessage(buff, tracker, origin);
    }

    private OnMessage(e: WebSocketEventMap['message']): void {
        const reader = new Reader(e.data);

        const commandId = reader.sfixed32();

        const commandInfo = Protomap.ProtocolAttributes.get(Protomap.Forward[commandId]);
        if (!commandInfo)
            throw new Error("Invalid message from server");

        const hasTracker = reader.bool();
        const origin = (hasTracker ? +reader.bool() : 0) as TrackerOrigin;
        const tracker = hasTracker ? reader.sfixed32() : 0;
        const hasData = reader.bool();

        const message = (commandInfo.Klass as any).decode(reader);

        console.log(`${commandId} ${hasTracker} ${TrackerOrigin[origin]} ${tracker} ${hasData}`)

        if (hasTracker)
            return this.OnMutationReceived(message, tracker, origin);
        else
            return this.OnMessage(message)
    }

    private Internal_SendMessage(buff: AnyProto, tracker?: number, origin?: TrackerOrigin)
    {
        this.Validate(buff);

        const writer = new Writer();
        const isMutation = tracker !== undefined;
        const data = SignalHandler.ResolveBuffId(buff);

        if (data === undefined)
            throw new Error("Invalid Buff");

        writer.sfixed32(data.DataId);
        writer.bool(isMutation);

        if (isMutation) {
            writer.sfixed32((TrackerOrigin as unknown) as number);
            writer.bool((TrackerOrigin as unknown) as boolean);
        }

        writer.bool(data.HasData);

        if (data.HasData)
            //@ts-ignore
            buff.encode(buff, writer);

        const res = writer.finish();
        (this.ws as WebSocket).send(res);

        Debug.Log(res);
    }

    private static ResolveBuffId(buff: AnyProto) {
        return Protomap.ProtocolAttributes.get(buff.constructor);
    }

    private Validate(buff: AnyProto) {
        if (!this.ws || !buff.hasOwnProperty.call(buff, "encode"))
            throw new Error("Invalid Status");
    }

    OnMutationReceived(buff: AnyProto, tracker: number, origin: TrackerOrigin): void { }

    OnSignalReceived(buff: AnyProto): void { }
}
