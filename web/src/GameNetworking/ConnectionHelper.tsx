import { GameNetworking } from "./GameNetworking";

export class ConnectionHelper {
    private networking: GameNetworking;

    private isDisposing: boolean;

    constructor(gameNetworking: GameNetworking) {
        this.networking = gameNetworking;

        this.isDisposing = false;
    }

    public Connect: (ip: string) => Promise<void> = async ip => {

    }
}
