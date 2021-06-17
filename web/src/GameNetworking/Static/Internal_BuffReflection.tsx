import {Service, Method, Type, rpc} from "protobufjs";

export class BuffReflection {
    public readonly ServiceList: [Service, typeof rpc.Service][] = [];
    public readonly Services: Map<Function, Service> = new Map<Function, Service>();
    public readonly ServiceMID: Map<Function | string, Record<string, number>> = new Map<Function | string, Record<string, number>>();

    public readonly MethodById: Record<number, Method> = {};
    // public readonly MethodToId: Map<Function, number> = new Map<Function, number>();
    // public readonly MethodStrToId: Record<string, number> = {};

    public readonly MethodDataRequest: Record<number, Type> = {};
    public readonly MethodDataResponse: Record<number, Type> = {};
    public readonly MethodDataRequestId: Map<Function, number> = new Map<Function, number>();
    public readonly MethodDataResponseId: Map<Function, number> = new Map<Function, number>();

    public readonly DispatchTypes: Map<Function, Type> = new Map<Function, Type>();
    public readonly DispatchTypesById: Record<number, Type> = {};
    public readonly DispatchTypesToId: Map<Function, number> = new Map<Function, number>();

    public readonly HasData: Map<Function, boolean> = new Map<Function, boolean>();

    //@ts-ignore
    public Headers: Type;
}
