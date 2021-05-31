import {Handlers} from "./index";
import {getType} from "typesafe-actions";
import {Actions} from "../Actions";

const Connect: Handlers = {};

Connect[getType(Actions.Connect.request)] = (state, { payload }) => ({
    ...state,
    isConnecting: true,
    connectionUrl: payload
});

Connect[getType(Actions.Connect.success)] = (state, { payload }) => ({
    ...state,
    isConnecting: false,
    connected: true,
    socket: payload,
    error: undefined
});

Connect[getType(Actions.Connect.failure)] = (state, { payload }) => ({
    ...state,
    isConnecting: false,
    error: payload
});

export { Connect };
