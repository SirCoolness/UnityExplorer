import {core} from "../../generated/Buffs";
import {Message, Reader, Type} from "protobufjs";
import BuffReflection from "../Static/BuffReflection";
import {GetType} from "../../Util/GetType";


export class MessageParser {
    public static ReadMessage: (data: Uint8Array) => [Message & core.IHeaders, Message | undefined] | undefined = data => {
        const reader = new Reader(data);

        const headers = BuffReflection.Headers.decodeDelimited(reader) as Message & core.IHeaders;

        if (!headers.HasData)
            return [headers, undefined];

        const rpc = headers.RPC;
        const cmdId = headers.CmdID as number;

        let parsedData: Message | undefined = undefined;

        if (!rpc) {
            parsedData = BuffReflection.DispatchTypesById[cmdId].decode(reader);
        } else {
            if (!rpc.IsResponse)
                parsedData = BuffReflection.MethodDataRequest[cmdId].decode(reader);
            else
                parsedData = BuffReflection.MethodDataResponse[cmdId].decode(reader);
        }

        return [headers, parsedData];
    }

    public static BuildHeaders: (buff: any, rpcDetails?: core.RPCDetails) => Message & core.IHeaders = (buff, rpcDetails) => {
        const headers = new BuffReflection.Headers.ctor() as Message & core.IHeaders;
        MessageParser.MutateHeaders(headers, buff, rpcDetails);
        return headers;
    }

    public static MutateHeaders: (headers: Message & core.IHeaders, buff: Message, rpcDetails?: core.RPCDetails) => void = (headers, buff, rpcDetails) => {
        let cmdID: number | undefined;

        const buffType = GetType(buff.$type.ctor);

        if (!rpcDetails) {
            cmdID = BuffReflection.DispatchTypesToId.get(buffType);
        } else {
            if (!rpcDetails.IsResponse)
                cmdID = BuffReflection.MethodDataRequestId.get(buffType);
            else
                cmdID = BuffReflection.MethodDataResponseId.get(buffType);
        }

        if (cmdID === undefined)
            throw new Error("Cannot resolve CmdID");

        headers.RPC = rpcDetails;
        headers.HasData = !!BuffReflection.HasData.get(buffType);
    }
}
