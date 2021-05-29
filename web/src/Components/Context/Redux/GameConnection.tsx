import React from 'react';

import { State } from '../../../Store';
import { GameConnectionState } from "../../../Store/Modules/GameConnection/Reducer";
import { Actions } from '../../../Store/Modules/GameConnection/Actions';
import * as AsyncActions from '../../../Store/Modules/GameConnection/AsyncActions/index';
import { CreateReduxContext } from '../../../Util/CreateReduxContext';

const generatedContext = CreateReduxContext<
    State,
    GameConnectionState,
    typeof Actions,
    typeof AsyncActions
    >({
    actions: Actions,
    asyncActions: AsyncActions,
    resolveState: state => state.GameConnection
});

export const GameConnectionContextProvider = generatedContext.provider;
export const useGameConnectionContext = generatedContext.useContext;
