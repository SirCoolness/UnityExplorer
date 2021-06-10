import { GameNetworking } from "../GameNetworking";
import {core} from "../../generated/Buffs";
import {Message, Type} from "protobufjs";
import {RPCTracker} from "./RPCTracker";
import {RPCBindings} from "./RPCBindings";

export class RPCHelper {
    private networking: GameNetworking;
    private tracking: RPCTracker;
    public bindings: RPCBindings;

    constructor(gameNetworking: GameNetworking) {
        this.networking = gameNetworking;

        this.tracking = new RPCTracker();
        this.bindings = new RPCBindings(this.networking);
    }

    public HandleRPC: (headers: Message & core.IHeaders, details?: Message) => Promise<void> = async (headers, details) => {
        const rpc = headers.RPC as core.RPCDetails;

        if (rpc.IsResponse) {
            // handle client rpc response
        } else {
            // server sent rpc
            // const buff: Message = undefined; //get buff
            //
            // // mutate RPC to skip recreating obj
            // rpc.IsResponse = true;
            // this.networking.message.SendMessage(buff, rpc);
        }
    }

    public HandleDispatch: (headers: Message & core.IHeaders, details?: Message) => Promise<void> = async (headers, details) => {

    }
}


