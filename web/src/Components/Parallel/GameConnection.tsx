import React, {useCallback, useEffect} from "react";
import {useGameConnectionContext} from "../Context/Redux/GameConnection";

export const GameConnection: React.FC = () => {
    const { api } = useGameConnectionContext();

    const main = useCallback(async () => {
        await api.TryConnecting("ws://127.0.0.1:6126");
    }, []);

    useEffect(() => {
        main().finally();
    }, [main]);

    return null;
}
