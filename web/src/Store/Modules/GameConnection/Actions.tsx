import {createAction, createAsyncAction} from 'typesafe-actions';
import { FlattenObject } from '@treestone/recursive-types';

export const Actions = {
    Connect: createAsyncAction(
        'GAME_CONNECTION/CONNECT/REQUEST',
        'GAME_CONNECTION/CONNECT/SUCCESS',
        'GAME_CONNECTION/CONNECT/FAILURE'
    )<string, WebSocket, Error>(),
    Disconnected: createAction('GAME_CONNECTION/DISCONNECTED')()
};

export type Actions = ReturnType<FlattenObject<typeof Actions>>;
