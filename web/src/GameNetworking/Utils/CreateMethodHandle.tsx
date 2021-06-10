import {Message, rpc, Type} from 'protobufjs';
import {AnyFunc} from "@treestone/recursive-types";
import BuffReflection from "../Static/BuffReflection";
import {GetType} from "../../Util/GetType";
import {State} from "../../Store";
import {Dispatch, DispatchSignal, DispatchSignalMutation, ThenArg, ThunkAction} from "../../types/utils";
import {core} from "../../generated/Buffs";
import {GameNetworking} from "../GameNetworking";

type MethodKeys<Service extends rpc.Service> = keyof Omit<Service, keyof rpc.Service>;
type GetPromise<A> = A extends AnyFunc ? ReturnType<A> extends Promise<any> ? A : never : never;

type Request<RequestType> = Omit<RequestType, keyof Message>;
type Response<ResponseType> = Omit<ResponseType, keyof Message>;

type MethodAction<
    TSignal extends any[],
    TReturn,
    TState = State> =
    (...args: TSignal) => ReturnType<ThunkAction<TSignal, TReturn, TState>>;

export type MethodHandleDetails<ResponseType extends Message> = [
    number,                            // method id
    PreBoundMethodHandle<ResponseType> // handle
];

export type PreBoundMethodHandle<ResponseType extends Message> = (game: GameNetworking) => BoundMethodHandle<ResponseType>;

export type BoundMethodHandle<ResponseType extends Message> = (request: Message) => Promise<ResponseType>;

export type MethodHandleBase<RequestType extends Message, ResponseType extends Message> = (
    request: Request<RequestType>,
    game: GameNetworking
) => Promise<Response<ResponseType>>;

export type MethodHandle<RequestType extends Message, ResponseType extends Message> =
    MethodAction<
        Parameters<MethodHandleBase<RequestType, ResponseType>>,
        ThenArg<ReturnType<MethodHandleBase<RequestType, ResponseType>>
    >
>;

export type CreateMethodHandleT = <
    Service extends typeof rpc.Service,
    Method extends MethodKeys<Service['prototype']>,
    PromiseFn extends GetPromise<Service['prototype'][Method]>
    >(
    service: Service,
    method: Method
) => (handle: MethodHandle<Parameters<PromiseFn>[0], ThenArg<ReturnType<PromiseFn>>>) => MethodHandleDetails<ThenArg<ReturnType<PromiseFn>>>;

const methodOptionKeys = ["(method.CmdID)", "(method.Sender)"];

export const CreateMethodHandle: CreateMethodHandleT = (service, method) => {
    const serviceType = GetType(service);

    const foundService = BuffReflection.Services.get(serviceType);

    if (!foundService)
        throw new Error("Failed to find service " + service.name);

    let CorrectedMethod = method as string;
    CorrectedMethod = CorrectedMethod[0].toUpperCase() + CorrectedMethod.slice(1, CorrectedMethod.length);

    const foundMethod = foundService.methods[CorrectedMethod];
    if (!foundMethod)
        throw new Error(`Failed to find ${foundService.fullName}.${method}`);

    for (const key of methodOptionKeys)
        if (!foundMethod.options?.hasOwnProperty(key))
            throw new Error(`Missing option ${key} in ${foundMethod.fullName}`);

    const mid: number = foundMethod.getOption("(method.CmdID)");

    return handle => {
        const wrapper: PreBoundMethodHandle<any> = (game) =>
            (request) =>
                handle(request as any, game)(game.store.dispatch, game.store.getState);

        return [
            mid,
            wrapper
        ];
    }
};
