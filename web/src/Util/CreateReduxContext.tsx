import React, { useContext } from 'react';
import { connect, MapDispatchToPropsNonObject } from 'react-redux';

import {
    BoundActionsRecursive,
    UnboundActionsRecursive
} from '../types/utils/index';

import { BindActionCreators } from './BindActionCreators';

type ActionProps = {
    actions: any;
    asyncActions?: any;
};

type StateProps = {
    state: any;
};

export const CreateReduxContext: <
    TState,
    TLocalState,
    TActions extends UnboundActionsRecursive = {},
    TAsyncActions extends UnboundActionsRecursive = {},
    TContextReturn = {
        state: TLocalState;
        api: {
            actions: BoundActionsRecursive<TActions>;
        } & BoundActionsRecursive<TAsyncActions>;
    }
    >(args: {
    actions: TActions;
    asyncActions?: TAsyncActions;
    resolveState: (state: TState) => TLocalState;
}) => {
    provider: React.FC;
    useContext: () => TContextReturn;
} = args => {
    const Context = React.createContext<any | {}>({});

    const mapStateToProps = (state: any) => {
        return {
            state: args.resolveState(state)
        };
    };

    const mapDispatchToProps: MapDispatchToPropsNonObject<
        ActionProps,
        {}
        > = dispatch => {
        const out: ActionProps = {
            actions: BindActionCreators(args.actions, dispatch)
        };

        if (args.asyncActions) {
            out.asyncActions = BindActionCreators(args.asyncActions, dispatch);
        }
        return out;
    };

    const ContextProvider: React.FC<ActionProps & StateProps> = props => {
        const { actions, asyncActions, state } = props;

        const api = React.useMemo(
            () => ({
                actions,
                ...asyncActions
            }),
            [actions, asyncActions]
        );

        const contextValue = React.useMemo(
            () => ({
                state,
                api
            }),
            [state, api]
        );

        return (
            <Context.Provider value={contextValue}>
                {props.children}
            </Context.Provider>
        );
    };

    return {
        provider: connect(mapStateToProps, mapDispatchToProps)(ContextProvider),
        useContext: () => useContext(Context)
    };
};
