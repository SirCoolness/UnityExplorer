import {InitialHandler} from "../../../../types/utils/actions";
import {Actions} from "../Actions";
import {createReducer} from "typesafe-actions";
import {Connect} from "./Connect";

export type Handlers = InitialHandler<GameConnectionState, Actions>;

export type GameConnectionState = {

};

const initialState: GameConnectionState = {
};

export const Reducer = createReducer(initialState, {
    ...Connect
});

