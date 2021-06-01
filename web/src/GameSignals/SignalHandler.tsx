import {SignalManager} from "./SignalManager";
import {Dispatch} from "../types/utils";
import {TryConnecting} from "../Store/Modules/GameConnection/AsyncActions";
import {State} from "../Store";
import {AnyProto, ProtocolAttribute, Protomap} from "../generated/ProtobufCommon";
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

    public Connect: () => Promise<void> = async () => {
        await this.dispatch(TryConnecting(this.ip));

        const state = this.getState();
        if (!state.GameConnection.connected)
            return;

        this.ws = state.GameConnection.socket;
        this.ws?.addEventListener("message", e => this.OnMessage(e).finally(), { });
    }

    public Dispose: () => Promise<void> = async () => {
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

    public SendMessage: (buff: AnyProto) => void = buff => {
        this.Internal_SendMessage(buff);
    }

    public SendMutation: (buff: AnyProto, tracker: number, origin: TrackerOrigin) => void = (buff, tracker, origin) => {
        this.Internal_SendMessage(buff, tracker, origin);
    }

    private OnMessage: (e: WebSocketEventMap['message']) => Promise<void> = async e => {
        const data = new Uint8Array(await (e.data as Blob).arrayBuffer());

        console.log("RECEIVED", Debug.DebugBuff(data));

        const reader = new Reader(data);

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
            return this.OnSignalReceived(message)
    }

    private Internal_SendMessage: (buff: AnyProto, tracker?: number, origin?: TrackerOrigin) => void = (buff, tracker, origin) => {
        if (!this.ws)
            throw new Error("Invalid Socket");

        const writer = new Writer();
        const isMutation = tracker !== undefined;
        const data = SignalHandler.ResolveBuffId(buff);

        if (data === undefined)
            throw new Error("Invalid Buff");

        writer.sfixed32(data.DataId);
        writer.bool(isMutation);

        if (isMutation) {
            writer.bool((TrackerOrigin as unknown) as boolean);
            writer.sfixed32((tracker as unknown) as number);
        }

        writer.bool(data.HasData);

        if (data.HasData)
            //@ts-ignore
            buff.encode(buff, writer);

        const res = writer.finish();
        (this.ws as WebSocket).send(res);

        console.log("SENDING", Debug.DebugBuff(res));
    }

    private static ResolveBuffId: (buff: AnyProto) => ProtocolAttribute | undefined = buff => {
        return Protomap.ProtocolAttributes.get(buff.constructor);
    }

    OnMutationReceived: (buff: AnyProto, tracker: number, origin: TrackerOrigin) => void = () => {}
    OnSignalReceived: (buff: AnyProto) => void = () => {}
}
