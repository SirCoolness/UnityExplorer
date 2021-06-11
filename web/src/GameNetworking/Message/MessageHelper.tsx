import { GameNetworking } from "../GameNetworking";
import { core} from "../../generated/Buffs";
import BuffReflection from "../Static/BuffReflection";
import {MessageParser} from "./MessageParser";
import {Message, Writer} from "protobufjs";

export class MessageHelper {
    private networking: GameNetworking;
    private headers: Message & core.IHeaders;

    constructor(gameNetworking: GameNetworking) {
        this.networking = gameNetworking;

        this.headers = new BuffReflection.Headers.ctor() as Message & core.IHeaders;

        console.log(BuffReflection)
    }

    public OnMessage: (e: WebSocketEventMap['message']) => Promise<void> = async e => {
        const data = new Uint8Array(await (e.data as Blob).arrayBuffer());

        const parsed = MessageParser.ReadMessage(data);
        if (!parsed)
            return console.error("Failed to parse message.");

        // debug message

        const headers = parsed[0];
        if (headers.RPC)
            await this.networking.rpc.HandleRPC(...parsed);
        else
            await this.networking.rpc.HandleDispatch(...parsed);
    }

    public SendMessage: (buff: Message, rpcDetails?: core.RPCDetails) => void = (buff, rpcDetails) => {
        MessageParser.MutateHeaders(this.headers, buff, rpcDetails);
        this.InternalSendMessage(this.headers, buff);
    }

    public SendMessageID: (CmdID: number, buff: Message, rpcDetails?: core.RPCDetails) => void = (CmdID, buff, rpcDetails) => {
        MessageParser.MutateHeadersID(this.headers, CmdID, rpcDetails);
        this.InternalSendMessage(this.headers, buff);
    }

    private InternalSendMessage: (headers: core.IHeaders, buff: Message) => void = (headers, buff) => {
        const writer = new Writer();

        BuffReflection.Headers.encodeDelimited(headers, writer);
        if (headers.HasData) {
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
