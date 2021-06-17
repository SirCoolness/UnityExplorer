import {GameNetworking} from "../GameNetworking";
import {RPCTracker} from "./RPCTracker";
import * as Buffs from "../../generated/Buffs";
import {BoundServices} from "./RPCImplementation";
import {Message, RPCImpl, Service} from "protobufjs";

export class RPCFakeService {
    private networking: GameNetworking;
    private impl: RPCImpl;

    constructor(gameNetworking: GameNetworking, service: Service, rpcImpl: RPCImpl) {
        this.networking = gameNetworking;
        this.impl = rpcImpl;

        this.BindMethods(service);
    }

    private BindMethods: (service: Service) => void = service => {
        service.methodsArray.forEach(m => {
            //@ts-ignore
            this[m.name] = this.BoundMethodProxy;
        })
    }

    private BoundMethodProxy: (request: Message, callback?: Message) => Promise<Message> | void = (request, callback) => {

    }
}
