import { State, Store } from "../Store";
import { ConnectionHelper } from "./ConnectionHelper";
import { MessageHelper } from "./Message/MessageHelper";
import { RPCHelper } from "./RPC/RPCHelper";
import {Sleep} from "../Util/Sleep";

export class GameNetworking {
    public store: Store<State>;
    public rpc: RPCHelper;
    public message: MessageHelper;
    public connection: ConnectionHelper;

    constructor(store: Store<State>) {
        this.store = store;

        this.rpc = new RPCHelper(this);
        this.message = new MessageHelper(this);
        this.connection = new ConnectionHelper(this);
    }

    public Connect: (ip: string, retry?: boolean) => Promise<void> = async (ip, retry) => {
        this.Bind();
        this.connection.ShouldReconnect = !!retry;

        let lastResponse = false;

        do {
            lastResponse = await this.TryConnecting(ip);

            if (retry && !lastResponse)
                await Sleep(10000);
        } while (retry && !lastResponse);
    }

    private TryConnecting: (ip: string) => Promise<boolean> = ip => this.connection.Connect(ip);

    private Bind: () => void = () => {
        this.rpc.bindings.Bind();

        this.connection.OnMessage = this.message.OnMessage;
        this.message['InternalSend'] = (e) => this.connection.SendMessage(e);
        this.rpc.Bind();
    }
}
