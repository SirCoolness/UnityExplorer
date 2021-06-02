import { IPingRequest, IPingResponse, PingRequest, PingResponse } from "./bi/ping";

export type AnyProto = 
	| IPingRequest
	| IPingResponse;

export interface ProtocolAttribute {
    HasData: boolean;
    DataId: number;
    Klass: Function;
}

export class Protomap {
    public static Forward: Record<number, Function> = {
        0: PingRequest.prototype.constructor,
		1: PingResponse.prototype.constructor
    };
    
    public static Reverse: Map<Function, number> = new Map([
        [PingRequest.prototype.constructor, 0],
		[PingResponse.prototype.constructor, 1]
    ]);
    
    public static ProtocolAttributes: Map<Function, ProtocolAttribute> = new Map([
        [PingRequest.prototype.constructor, { HasData: true, DataId: 0, Klass: PingRequest }],
		[PingResponse.prototype.constructor, { HasData: true, DataId: 1, Klass: PingResponse }]
    ]);
}
