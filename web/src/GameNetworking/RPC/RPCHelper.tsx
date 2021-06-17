import { GameNetworking } from "../GameNetworking";
import {core} from "../../generated/Buffs";
import {Message} from "protobufjs";
import {RPCTracker} from "./RPCTracker";
import {RPCBindings} from "./RPCBindings";
import {BoundDispatchHandle, BoundMethodHandle} from "../Utils/CreateMethodHandle";
import {RPCImplementation} from "./RPCImplementation";

export class RPCHelper {
    private networking: GameNetworking;
    private implementation: RPCImplementation;
    public bindings: RPCBindings;

    constructor(gameNetworking: GameNetworking) {
        this.networking = gameNetworking;

        this.implementation = new RPCImplementation(this.networking);
        this.bindings = new RPCBindings(this.networking);
    }

    public HandleRPC: (headers: Message & core.IHeaders, details?: Message) => Promise<void> = async (headers, details) => {
        const rpc = headers.RPC as core.RPCDetails;

        if (rpc.IsResponse) {
            // server responded to rpc
            await this.implementation.HandleServerResponse(headers, details);
        } else {
            // server sent rpc
            const buff = await this.ResolveResponse(this.bindings.BoundMethods, headers, details); //get buff
            if (!buff) // TODO: support optional responses
                return;

            // mutate RPC to skip recreating obj
            rpc.IsResponse = true;
            this.networking.message.SendMessageID(headers.CmdID as number, buff, rpc);
        }
    }

    public HandleDispatch: (headers: Message & core.IHeaders, details?: Message) => Promise<void> = async (headers, details) => {
        // server sent message without expecting a response
        await this.ResolveResponse(this.bindings.BoundMethods, headers, details);
    }

    private ResolveResponse: (
        bindings: Record<number, BoundMethodHandle<any> | BoundDispatchHandle>,
        headers: Message & core.IHeaders,
        details?: Message) =>
            Promise<Message | undefined> =
        async (bindings, headers, details) => {
        const binding = bindings[headers.CmdID as number];
        if (!binding)
            return undefined;

        return await binding(details);
    }

    public Bind: () => void = () => {
        this.implementation.BindServices();
    }
}


