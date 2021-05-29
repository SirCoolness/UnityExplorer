import { combineReducers } from 'redux';
import {GameConnectionReducer} from "./Modules/GameConnection";

export const RootReducer = combineReducers({
    GameConnection: GameConnectionReducer
});

export type State = ReturnType<typeof RootReducer>;
