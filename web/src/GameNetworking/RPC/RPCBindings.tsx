import * as Handles from '../Handles';
import {GameNetworking} from "../GameNetworking";
import {BoundMethodHandle, MethodHandleDetails} from "../Utils/CreateMethodHandle";

export class RPCBindings {
    private networking: GameNetworking;
    public BoundMessages: Record<number, BoundMethodHandle<any>> = {};

    constructor(gameNetworking: GameNetworking) {
        this.networking = gameNetworking;
    }

    public Bind: () => void = () => {
        this.BoundMessages = {};

        this.RecursivelyBind(Handles, "Handles");
    }

    private RecursivelyBind: <TArgs>(value: TArgs, recursionDebug: string) => void = (value, recursionDebug) => {
        if (typeof value !== 'object')
            return console.error(`[${recursionDebug}] Error during recursion, value is ${typeof value}`, value);

        if (!Array.isArray(value))
            for (const key of Object.keys(value))
                return this.RecursivelyBind((value as Record<any, any>)[key as string], recursionDebug + "." + key);

        const [mid, preBound] = (value as unknown) as MethodHandleDetails<any>;

        if (this.BoundMessages.hasOwnProperty(mid))
            return console.error(`[${recursionDebug}] Cannot bind since already has been bound.`, value);

        this.BoundMessages[mid] = preBound(this.networking);
    }
}
