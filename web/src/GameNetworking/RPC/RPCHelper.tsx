import { GameNetworking } from "../GameNetworking";

export class RPCHelper {
    private networking: GameNetworking;

    constructor(gameNetworking: GameNetworking) {
        this.networking = gameNetworking;
    }
}
