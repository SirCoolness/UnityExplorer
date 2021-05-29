import { Dispatch } from 'react';
import { bindActionCreators as bindActionCreatorsNonRecursive } from 'redux';

import {
    BoundActionsRecursive,
    UnboundActionsRecursive
} from '../types/utils';

/**
 *
 * @param actions
 * @param dispatch
 * @returns {any}
 */
export const BindActionCreators: <TActions extends UnboundActionsRecursive>(
    actions: TActions,
    dispatch: Dispatch<any>
) => BoundActionsRecursive<TActions> = (actions, dispatch) =>
    Object.entries(actions).reduce<any>((acc, [name, value]) => {
        if (!value) return acc;
        const bind =
            typeof value === 'function'
                ? bindActionCreatorsNonRecursive
                : BindActionCreators;
        //@ts-ignore
        acc[name] = bind(value, dispatch);
        return acc;
    }, {});
