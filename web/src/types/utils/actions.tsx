import {Action} from 'typesafe-actions/dist/type-helpers';

export type GetAction<
    TAction extends Action,
    TType extends TAction['type']
    > = TAction extends Action<TType> ? TAction : never;

export type InitialHandler<TState, TRootAction extends Action> = {
    [P in TRootAction['type']]?: (
        state: TState,
        action: GetAction<TRootAction, P>
    ) => TState;
};

export type OptionalArray<T> = T | Array<T>;

export type DiscriminateUnionOfInterfaces<TUnion extends object, TTypedCommonParent extends object> =
    TUnion extends infer D
        ? D extends TTypedCommonParent
        ? D
        : never : never;

/**
 * used to allow mutable objects to still have a unique signature
 */
export type SignedMutable<TSigningType> = {
    $$sig: TSigningType;
}
