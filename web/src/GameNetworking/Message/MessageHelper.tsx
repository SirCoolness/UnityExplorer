import { GameNetworking } from "../GameNetworking";
import { core} from "../../generated/Buffs";
import BuffReflection from "../Static/BuffReflection";

export class MessageHelper {
    private networking: GameNetworking;

    constructor(gameNetworking: GameNetworking) {
        this.networking = gameNetworking;

        console.log(BuffReflection)
    }

    public OnMessage: (e: WebSocketEventMap['message']) => Promise<void> = async e => {
        // decode message
    }

    public SendMessage: (buff: any, rpcDetails?: core.RPCDetails) => void = (buff, rpcDetails) => {
        // encode message
    }
}
