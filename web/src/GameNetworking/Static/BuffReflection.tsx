import '../../generated/Reflection';
import * as Buffs from '../../generated/Buffs';
import {Direction} from '../../generated/Buffs';

import pbjs, {Method, Namespace, NamespaceBase, ReflectionObject, roots, Service, Type} from 'protobufjs';
import {LookupObject} from "../../Util/LookupObject";
import {BuffReflection} from "./Internal_BuffReflection";
import {GetType} from "../../Util/GetType";

const Root = roots.default;

class BuffReflectionHelper {
    private static reflection: BuffReflection;
    private static isLoaded = false;

    private static methodOptionKeys = ["(method.CmdID)", "(method.Sender)"];
    private static messageOptionKeys = ["(message.CmdID)", "(message.Sender)"];

    private static Load: () => void = () => {
        if (BuffReflectionHelper.isLoaded)
            return;

        BuffReflectionHelper.isLoaded = true;
        BuffReflectionHelper.reflection = new BuffReflection();

        BuffReflectionHelper.HandleGeneric(Root);
    }

    private static HandleGeneric: (reflection: ReflectionObject) => void = reflection => {
        console.log(reflection)
        if (reflection instanceof Type)
            BuffReflectionHelper.HandleType(reflection);
        else if (reflection instanceof Service)
            BuffReflectionHelper.HandleService(reflection);
        else if (reflection instanceof Namespace || reflection instanceof pbjs.Root)
            BuffReflectionHelper.LoadNested(reflection);
    }

    private static LoadNested: (reflection: NamespaceBase) => void = reflection => {
        reflection.nestedArray.forEach(item => BuffReflectionHelper.HandleGeneric(item));
    }

    private static HandleService: (service: Service) => void = service => {
        const methods = service.methodsArray.filter(BuffReflectionHelper.HandleMethod);
        if (methods.length) {
            BuffReflectionHelper.reflection.Services.set(GetType(LookupObject(service.fullName, Buffs)), service);
        }

        BuffReflectionHelper.LoadNested(service);
    }

    private static HandleType: (t: Type) => void = t => {
        if (BuffReflectionHelper.IsMethod(t))
        {
            const mid = t.getOption("(message.CmdID)");
            const direction = BuffReflectionHelper.ParseDirection(t.getOption("(message.Sender)"));

            if (direction === Direction.CLIENT || direction === Direction.BOTH)
            {
                if (!BuffReflectionHelper.reflection.DispatchTypesById.hasOwnProperty(mid))
                {
                    BuffReflectionHelper.reflection.DispatchTypesById[mid] = t;
                    BuffReflectionHelper.reflection.DispatchTypes.set(GetType(LookupObject(t.fullName, Buffs)), t);
                } else {
                    console.error(`Cannot register [${t.fullName}]: \"(message.CmdID)\" ${mid} is already registered to [${BuffReflectionHelper.reflection.DispatchTypesById[mid].fullName}].`);
                }
            }
        }

        BuffReflectionHelper.LoadNested(t);
    }

    private static HandleMethod: (method: Method) => boolean = method => {
        if (!BuffReflectionHelper.IsMethod(method))
            return false;

        const direction = BuffReflectionHelper.ParseDirection(method.getOption("(method.Sender)"));
        if (direction !== Buffs.Direction.CLIENT && direction !== Buffs.Direction.BOTH)
            return false;

        const mid = method.getOption("(method.CmdID)");
        if (BuffReflectionHelper.reflection.MethodById.hasOwnProperty(mid))
        {
            console.error(`Cannot register [${method.fullName}]: \"(method.CmdID)\" ${mid} is already registered to [${BuffReflectionHelper.reflection.MethodById[mid].fullName}].`);
            return false;
        }

        BuffReflectionHelper.reflection.MethodById[mid] = method;

        return true;
    }

    private static IsMethod: (t: ReflectionObject) => boolean = t => {
        const keys = t instanceof Type ? BuffReflectionHelper.messageOptionKeys : BuffReflectionHelper.methodOptionKeys;

        for (const key of keys)
            if (!t.options?.hasOwnProperty(key))
                return false;

        return true;
    }

    private static ParseDirection: (t: string) => Buffs.Direction = t => (Buffs.Direction[t as any] as unknown) as Buffs.Direction;
}

BuffReflectionHelper['Load']();

export default BuffReflectionHelper['reflection'];
