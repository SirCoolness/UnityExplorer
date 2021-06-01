import {SignalAction} from "../../../types/utils";
import {PingRequest, PingResponse} from "../../../generated/bi/ping";

export const Ping: SignalAction<PingRequest, PingResponse> = buff => () => async () => {
    console.log("Ping:", buff.message);

    return new PingResponse({
        message: "Response " + buff.message
    });
}
