import {Handlers} from "./index";
import {getType} from "typesafe-actions";
import {Actions} from "../Actions";

const Disconnected: Handlers = {};

Disconnected[getType(Actions.Disconnected)] = state => ({
    ...state,
    connected: false,
    socket: undefined
})

export { Disconnected };
