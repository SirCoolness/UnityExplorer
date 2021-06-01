import { Store as RStore, createStore } from 'redux';

import {RootReducer, State} from "./Reducer";
import {ComposeEnhancers} from "../Util/ComposeEnhancers";
import {InitEnhancers} from "./Enhancers";
import {Dispatch} from "../types/utils";

export type Store<T> = Omit<RStore<T>, "dispatch"> & {
    dispatch: Dispatch
}

export const InitStore: () => Store<State> = () => createStore(RootReducer, undefined, ComposeEnhancers(...InitEnhancers()));
