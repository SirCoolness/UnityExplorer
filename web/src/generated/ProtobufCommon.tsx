import { IPingRequest, IPingResponse, PingRequest, PingResponse } from "./bi/ping";

export type AnyProto = 
	| IPingRequest
	| IPingResponse;

interface ProtocolAttribute {
    HasData: boolean;
    DataId: number;
    Klass: Function;
}

export class Protomap {
    public static Forward: Record<number, Function> = {
        0: PingRequest.constructor,
		1: PingResponse.constructor
    };
    
    public static Reverse: Map<Function, number> = new Map([
        [PingRequest.constructor, 0],
		[PingResponse.constructor, 1]
    ]);
    
    public static ProtocolAttributes: Map<Function, ProtocolAttribute> = new Map([
        [PingRequest.constructor, { HasData: false, DataId: 0, Klass: PingRequest }],
		[PingResponse.constructor, { HasData: false, DataId: 1, Klass: PingResponse }]
    ]);
}
