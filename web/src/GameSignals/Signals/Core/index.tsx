import {SignalMap} from "../../SignalStore";
import {PingRequest} from "../../../generated/bi/ping";
import {Ping} from "./Ping";

export const CoreSignals: SignalMap = [
    [PingRequest, Ping]
];
