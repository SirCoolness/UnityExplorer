import {Message, Method, rpc, RPCImpl, Service} from "protobufjs";
import {GameNetworking} from "../GameNetworking";
import {RPCTracker} from "./RPCTracker";
import {RPCBindings} from "./RPCBindings";
import BuffReflection from "../Static/BuffReflection";
import {GetType} from "../../Util/GetType";
import {core, game} from "../../generated/Buffs";
import * as Buffs from '../../generated/Buffs';
import {MakeOptionalRecursive, ThenArg, ThunkAction, UnboundActionsRecursive} from "../../types/utils";
import {AnyFunc, FindTypeAndReplace} from "@treestone/recursive-types";
import * as $protobuf from "protobufjs";
import {ActionCreator} from "typesafe-actions";
import {RPCFakeService} from "./RPCFakeService";

type True = "$$TRUE";
type False = "$$FALSE";

interface OMIT_ME {
    $$TYPE: "OMIT_ME"
}

interface DONT_OMIT<T> {
    $$D: T;
}

export type BoundServices<TSource> = {
    [P in keyof TSource]: TSource[P] extends typeof rpc.Service
        ? Omit<TSource[P]['prototype'], keyof $protobuf.rpc.Service>
        : TSource[P] extends AnyFunc
            ? never
            : TSource[P] extends object
                ? BoundServices<TSource[P]>
                : never
};

export class RPCImplementation {
    private networking: GameNetworking;
    private tracking: RPCTracker;
    //@ts-ignore
    private services: BoundServices<typeof Buffs> = {};

    constructor(gameNetworking: GameNetworking) {
        this.networking = gameNetworking;

        this.tracking = new RPCTracker();
    }

    public BindServices = () => {
        let out = {};

        for (const [service, staticService] of BuffReflection.ServiceList) {
            out = {
                ...out,
                ...RPCImplementation.StringToObject(out, service.fullName, new RPCFakeService(this.networking, service, this.BuildImplementationCB(service)))
            }
        }

        this.services = out as any;

        console.log(out)

        this.services.game.Scene.sceneFind(new game.SceneFindRequest({
            path: "foo"
        }), console.log);
    }

    private static StringToObject: (source: Object, path: string, value: any) => object = (source, path, value) => {
        const p = path.split('.');
        if (p[0] === "") p.shift();

        if (p.length <= 0)
            return {};

        let res = {
            [p[p.length - 1]]: value
        };

        if (p.length <= 0)
            return res;

        for (let i = p.length - 2; i >= 0; i--) {
            res = {
                [p[i]]: res
            }
        }

        // kinda a crappy merge system but good enough
        // brain ain't working the best when I wrote this
        //@ts-ignore
        const mergeRecursive = (a: any, b: any, keys: string[]) => {
            const key = keys[0];

            if (keys.length <= 1)
                return {
                    ...a,
                    [key]: b[key]
                }

            keys.shift();
            return {
                ...a,
                //@ts-ignore
                [key]: mergeRecursive(a[key], b[key], keys)
            }
        }

        return mergeRecursive(source, res, [...p]);
    }

    private BuildImplementationCB: (service: Service | rpc.Service) => RPCImpl = service => {
        let stype: Function | string | undefined = undefined;

        //@ts-ignore
        if (!!service.__proto__?.create)
            stype = (service as Service).fullName;
        else
            stype = GetType(service);

        const serviceMIDS = BuffReflection.ServiceMID.get(stype);
        if (!serviceMIDS)
            throw new Error("Cannot build implementation. Failed to resolve service MID.");

        return (
            method,
            requestData,
            callback
        ) => {
            const tracker = this.tracking.AddTrackedCallback((headers, buff) => {
                callback(null, buff as any);
            });
            console.log(method.name);
            callback(null);
        }
    }

    public HandleServerResponse: (headers: Message & core.IHeaders, details?: Message) => Promise<void> = async (headers, details) => {

    }
}
