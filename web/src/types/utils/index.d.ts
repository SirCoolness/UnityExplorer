import {FC} from 'react';
import { Action, ActionCreator } from 'typesafe-actions';
import {State} from "../../Store";
import {AnyProto} from "../../generated/ProtobufCommon";

export type FixDefaults<
    T extends FC<any>,
    D
    > = Omit<T, 'defaultProps'> & // remove defaultProps
    (T extends (...a: infer A) => infer R ? (...a: A) => R : never) & {
    // keep signature
    defaultProps: D;
}; // new defaults

export type ExtendObject<TElement extends object, TProps extends object> = Omit<TElement, keyof TProps> & TProps;


// Force object recursively to have all keys be required
export type MakeRequiredRecursive<T> =
    Required<{
        [P in keyof T]: T[P] extends object
            ? MakeRequiredRecursive<Required<T[P]>>
            : T[P];
    }>;

// Force object recursively to be optional
export type MakeOptionalRecursive<T> =
    Partial<{
        [P in keyof T]: T[P] extends object
            ? MakeOptionalRecursive<T[P]>
            : T[P];
    }>;

type UnboundActionsRecursive = {
    [key: string]: UnboundActionsRecursive | ActionCreator | ThunkAction<any, any, any>;
}

type AsyncReturnType<T extends (...args: any) => any> =
    T extends (...args: any) => Promise<infer U> ? U :
        T extends (...args: any) => infer U ? U :
            any

export type BoundActionsRecursive<TSource extends UnboundActionsRecursive> = {
    [P in keyof TSource]: TSource[P] extends UnboundActionsRecursive
        ? BoundActionsRecursive<TSource[P]>
        : TSource[P] extends ThunkAction<any, any, any>
            ? (...args: Parameters<TSource[P]>) => Promise<Unwrap<ReturnType<TSource[P]>>>
            : TSource[P] extends ActionCreator
                ? (...args: Parameters<TSource[P]>) => void
                : any;
};

export type PlaceholderType<TValue, TKey = "DEFAULT"> = TValue;

export type ReplacePlaceholders<TSource extends object, TPlaceholders extends PlaceholderType<any>, TReplaceWith> =
    {
        [P in keyof TSource]: TSource[P] extends TPlaceholders
        ? TReplaceWith
        : TSource[P] extends object
            ? ReplacePlaceholders<TSource[P], TPlaceholders, TReplaceWith>
            : unknown;
    }

type Unwrap<T> = T extends (infer U)[] ? U : T

//@ts-ignore
export type SerializeTypes<TSource extends object, TKeys = TSource[keyof TSource]> = TKeys extends object ? SerializeTypes<TKeys> : TKeys;

export type Dispatch = <TArgs>(args: TArgs) => TArgs extends Action ? void : TArgs extends ReturnType<ThunkAction<any, any, any>> ? ReturnType<TArgs> : unknown;

export type DispatchSignalMutation = <TRequest extends AnyProto, TResponse extends AnyProto>(buff: TRequest) => Promise<TResponse>;
export type DispatchSignal = <TRequest extends AnyProto>(buff: TRequest) => void;

export type SignalAction<TSignal extends AnyProto, TReturn extends AnyProto = void, TState = State> = (signal: TSignal) => (isTracked: boolean, dispatchSignal: DispatchSignal, dispatchMutation: DispatchSignalMutation) => ReturnType<ThunkAction<TSignal, TReturn, TState>>;

export type ThunkAction<TArgs, TReturn = void, TState = State> = (args: TArgs) => (dispatch: Dispatch, getState: () => TState) => Promise<TReturn>;

