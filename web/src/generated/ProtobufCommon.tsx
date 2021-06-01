import { IPingRequest, IPingResponse, PingRequest, PingResponse } from "./bi/ping";

export type AnyProto = 
	| IPingRequest
	| IPingResponse;

export class Protomap {
    public static Forward: Record<number, Function> = {
        0: PingRequest.constructor,
		1: PingResponse.constructor
    };
    
    public static Reverse: Map<Function, number> = new Map([
        [PingRequest.constructor, 0],
		[PingResponse.constructor, 1]
    ]);
}
