import {Service, Method, Type} from "protobufjs";
import {core, Scene} from "../../generated/Buffs";

export class BuffReflection {
    public readonly Services: Map<Function, Service> = new Map<Function, Service>();

    public readonly MethodById: Record<number, Method> = {};

    public readonly MethodDataRequest: Record<number, Type> = {};
    public readonly MethodDataResponse: Record<number, Type> = {};
    public readonly MethodDataRequestId: Map<Function, number> = new Map<Function, number>();
    public readonly MethodDataResponseId: Map<Function, number> = new Map<Function, number>();

    public readonly DispatchTypes: Map<Function, Type> = new Map<Function, Type>();
    public readonly DispatchTypesById: Record<number, Type> = {};
    public readonly DispatchTypesToId: Map<Function, number> = new Map<Function, number>();

    public readonly HasData: Map<Function, boolean> = new Map<Function, boolean>();

    public Headers: typeof core.Headers = core.Headers;
}
