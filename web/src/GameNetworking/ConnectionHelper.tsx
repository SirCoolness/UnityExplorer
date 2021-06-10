import { GameNetworking } from "./GameNetworking";
import {TryConnecting} from "../Store/Modules/GameConnection/AsyncActions";
import {Actions} from "../Store/Modules/GameConnection/Actions";

export class ConnectionHelper {
    private networking: GameNetworking;

    private isDisposing: boolean;
    private ws?: WebSocket;

    public OnMessage?: (e: WebSocketEventMap['message']) => Promise<void> | void;
    public SendMessage: WebSocket['send'];

    public ShouldReconnect: boolean = false;

    constructor(gameNetworking: GameNetworking) {
        this.networking = gameNetworking;
        this.isDisposing = false;
        this.SendMessage = this.InternalSendMessage;
    }

    public Connect: (ip: string) => Promise<boolean> = async ip => {
        await this.networking.store.dispatch(TryConnecting(ip));

        const state = this.networking.store.getState();
        if (!state.GameConnection.connected)
            return state.GameConnection.connected;

        this.Bind();

        return state.GameConnection.connected;
    }

    private Bind: () => void = () => {
        this.ws?.addEventListener('message', this.InternalOnMessage, { passive: true });
        this.ws?.addEventListener('close', this.OnClose, { passive: true });
        this.SendMessage = this.ws?.send || this.InternalSendMessage;
    }

    private InternalOnMessage: (e: WebSocketEventMap['message']) => Promise<void> = async e => {
        await this.OnMessage?.(e);
    }

    private InternalSendMessage: WebSocket['send'] = e => {
        if (!this.ws)
            throw new Error("Socket not connected.")

        this.ws.send(e);
    }

    private OnClose: (e: WebSocketEventMap['close']) => Promise<void> = async e => {
        const reconnectUrl = this.ws?.url;
        this.ws?.close();
        this.ws = undefined;

        this.networking.store.dispatch(Actions.Disconnected());

        if (this.ShouldReconnect && reconnectUrl)
            await this.networking.Connect(reconnectUrl, this.ShouldReconnect);
        else if (this.ShouldReconnect && !reconnectUrl)
            console.error("cannot reconnect. missing url")
    }
}
