import {InitialHandler} from "../../../../types/utils/actions";
import {Actions} from "../Actions";
import {createReducer} from "typesafe-actions";
import {Connect} from "./Connect";

export type Handlers = InitialHandler<GameConnectionState, Actions>;

export type GameConnectionState = {
    connected: boolean;
    isConnecting: boolean;
    connectionUrl?: string;
    socket?: WebSocket;
    error?: Error;
};

const initialState: GameConnectionState = {
    connected: false,
    isConnecting: false
};

export const Reducer = createReducer(initialState, {
    ...Connect
});

