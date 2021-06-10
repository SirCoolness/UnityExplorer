import React, {useCallback, useEffect, useMemo} from "react";
import {useStore} from "react-redux";
import { GameNetworking } from "../../GameNetworking/GameNetworking";
import {State, Store} from "../../Store";

type GameContext = {
    value: GameNetworking
};

const Context = React.createContext<GameContext | void>(undefined);

export const GameSignalContextProvider: React.FC = props => {
    const store = useStore<State>();

    const signalProvider = useMemo(() => new GameNetworking(store as Store<State>), [store]);

    const main = useCallback(async () => {
        await signalProvider.Connect("ws://127.0.0.1:6126", true);
    }, [signalProvider]);

    useEffect(() => {
        main().finally();
    }, [main]);

    return <Context.Provider value={{ value: signalProvider }}>
        {props.children}
    </Context.Provider>;
};

export const useGameSignal: () => GameNetworking = () => (React.useContext(Context) as GameContext).value;
