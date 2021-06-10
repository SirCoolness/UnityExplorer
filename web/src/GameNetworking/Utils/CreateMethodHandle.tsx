import {Message, rpc} from 'protobufjs';
import {AnyFunc} from "@treestone/recursive-types";
import {Unwrap} from "../../types/utils";

type MethodKeys<Service extends rpc.Service> = keyof Omit<Service, keyof rpc.Service>;
type GetPromise<A> = A extends AnyFunc ? ReturnType<A> extends Promise<any> ? A : never : never;
type ThenArg<T> = T extends PromiseLike<infer U> ? U : T

type Request<RequestType> = Omit<RequestType, keyof Message> & Message<Omit<RequestType, keyof Message>>;
type Response<ResponseType> = Omit<ResponseType, keyof Message>;

export type MethodHandleDetails = {
    handle: BoundMethodHandle;
};

export type BoundMethodHandle = () => void;

// @ts-ignore
export type MethodHandle<RequestType, ResponseType> = (
    request: Request<RequestType>
) => Promise<Response<ResponseType>>;

export type CreateMethodHandleT = <
    Service extends typeof rpc.Service,
    Method extends MethodKeys<Service['prototype']>,
    PromiseFn extends GetPromise<Service['prototype'][Method]>
    >(
    service: Service,
    method: Method
) => (handle: MethodHandle<Parameters<PromiseFn>[0], ThenArg<ReturnType<PromiseFn>>>) => MethodHandleDetails;

export const CreateMethodHandle: CreateMethodHandleT = (service, method) => {
    return handle => {
        //@ts-ignore
        const wrapper: BoundMethodHandle = () => handle();

        return {
            handle: wrapper
        };
    }
};
