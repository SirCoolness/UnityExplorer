import { Store, createStore } from 'redux';

import {RootReducer, State} from "./Reducer";
import {ComposeEnhancers} from "../Util/ComposeEnhancers";
import {InitEnhancers} from "./Enhancers";

export const InitStore: () => Store<State> = () => createStore(RootReducer, undefined, ComposeEnhancers(...InitEnhancers()));
