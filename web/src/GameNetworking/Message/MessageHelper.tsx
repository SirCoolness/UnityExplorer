import { GameNetworking } from "../GameNetworking";
import { core} from "../../generated/Buffs";
import BuffReflection from "../Static/BuffReflection";
import {MessageParser} from "./MessageParser";
import {Message, Type, Writer} from "protobufjs";
import {GetType} from "../../Util/GetType";

export class MessageHelper {
    private networking: GameNetworking;
    private headers: core.Headers;

    constructor(gameNetworking: GameNetworking) {
        this.networking = gameNetworking;

        this.headers = new BuffReflection.Headers();

        console.log(BuffReflection)
    }

    public OnMessage: (e: WebSocketEventMap['message']) => Promise<void> = async e => {
        const data = new Uint8Array(await (e.data as Blob).arrayBuffer());

        const parsed = MessageParser.ReadMessage(data);
        if (!parsed)
            return console.error("Failed to parse message.");

        // route message
    }

    public SendMessage: (buff: Message, rpcDetails?: core.RPCDetails) => void = (buff, rpcDetails) => {
        const writer = new Writer();

        MessageParser.MutateHeaders(this.headers, buff, rpcDetails);
        BuffReflection.Headers.encodeDelimited(this.headers, writer);

        if (this.headers.HasData) {
            buff.$type.encode(buff, writer);
        }

        const res = writer.finish();
        this.InternalSend(res);

        // handle debugging
    }

    private InternalSend: WebSocket['send'] = () => {
        throw new Error("InternalSend is not bound.");
    }
}
