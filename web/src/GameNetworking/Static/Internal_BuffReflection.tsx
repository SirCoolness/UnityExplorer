import {Service, Method, Type} from "protobufjs";
import {Scene} from "../../generated/Buffs";

export class BuffReflection {
    public readonly Services: Map<Function, Service> = new Map<Function, Service>();

    public readonly MethodById: Record<number, Method> = {};

    public readonly DispatchTypes: Map<Function, Type> = new Map<Function, Type>();
    public readonly DispatchTypesById: Record<number, Type> = {};
}
