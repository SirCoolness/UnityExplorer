import {Message, Method, rpc, RPCImpl, Service} from "protobufjs";
import {GameNetworking} from "../GameNetworking";
import {RPCTracker} from "./RPCTracker";
import {RPCBindings} from "./RPCBindings";
import BuffReflection from "../Static/BuffReflection";
import {GetType} from "../../Util/GetType";
import {core} from "../../generated/Buffs";

export class RPCImplementation {
    private networking: GameNetworking;
    private tracking: RPCTracker;

    constructor(gameNetworking: GameNetworking) {
        this.networking = gameNetworking;

        this.tracking = new RPCTracker();
    }

    public BuildImplementationCB: (service: Service | rpc.Service) => RPCImpl = service => {
        let stype: Function | string | undefined = undefined;

        if (service.hasOwnProperty("create"))
            stype = (service as Service).fullName;
        else
            stype = GetType(service);

        const serviceMIDS = BuffReflection.ServiceMID.get(stype);
        if (!serviceMIDS)
            throw new Error("Cannot build implementation. Failed to resolve service MID.");

        return (
            method,
            requestData,
            callback
        ) => {
            console.log(method.name);
            callback(null);
        }
    }

    public HandleServerResponse: (headers: Message & core.IHeaders, details?: Message) => Promise<void> = async (headers, details) => {

    }
}
