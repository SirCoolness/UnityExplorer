import { GameNetworking } from "./GameNetworking";
import {TryConnecting} from "../Store/Modules/GameConnection/AsyncActions";

export class ConnectionHelper {
    private networking: GameNetworking;

    private isDisposing: boolean;
    private ws?: WebSocket;

    public OnMessage?: (e: WebSocketEventMap['message']) => Promise<void> | void;
    public SendMessage: WebSocket['send'];

    constructor(gameNetworking: GameNetworking) {
        this.networking = gameNetworking;
        this.isDisposing = false;
        this.SendMessage = this.InternalSendMessage;
    }

    public Connect: (ip: string) => Promise<void> = async ip => {
        await this.networking.store.dispatch(TryConnecting(ip));

        const state = this.networking.store.getState();
        if (!state.GameConnection.connected)
            return;

        this.ws = state.GameConnection.socket;

        this.Bind();
    }

    private Bind: () => void = () => {
        this.ws?.addEventListener('message', this.InternalOnMessage, { passive: true });
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
}
