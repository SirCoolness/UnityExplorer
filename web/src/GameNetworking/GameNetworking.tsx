import { State, Store } from "../Store";
import { ConnectionHelper } from "./ConnectionHelper";
import { MessageHelper } from "./Message/MessageHelper";
import { RPCHelper } from "./RPC/RPCHelper";

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

    public Connect: (ip: string) => Promise<void> = (ip) => {
        this.Bind();
        return this.connection.Connect(ip);
    }

    private Bind: () => void = () => {

    }
}
