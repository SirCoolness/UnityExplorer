import {core} from "../../generated/Buffs";
import {Reader, Type} from "protobufjs";
import BuffReflection from "../Static/BuffReflection";
import {GetType} from "../../Util/GetType";


export class MessageParser {
    public static ReadMessage: (data: Uint8Array) => [core.Headers, Object | undefined] | undefined = data => {
        const reader = new Reader(data);

        const headers = BuffReflection.Headers.decodeDelimited(reader);

        if (!headers.HasData)
            return [headers, undefined];

        const rpc = headers.RPC;
        const cmdId = headers.CmdID;

        let parsedData: Object | undefined = undefined;

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

    public static BuildHeaders: (buff: any, rpcDetails?: core.RPCDetails) => core.Headers = (buff, rpcDetails) => {
        const headers = new BuffReflection.Headers();
        MessageParser.MutateHeaders(headers, buff, rpcDetails);
        return headers;
    }

    public static MutateHeaders: (headers: core.Headers, buff: any, rpcDetails?: core.RPCDetails) => void = (headers, buff, rpcDetails) => {
        let cmdID: number | undefined;

        const buffType = buff instanceof Type ? buff.ctor : GetType(buff);

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
