import React, {useCallback, useEffect, useMemo} from "react";
import {useGameConnectionContext} from "../Context/Redux/GameConnection";
import {useStore} from "react-redux";
import {SignalManager} from "../../GameSignals/SignalManager";
import {State, Store} from "../../Store";

type GameSignalContext = {
    value: SignalManager
};

const Context = React.createContext<GameSignalContext | void>(undefined);

export const GameSignalContextProvider: React.FC = props => {
    const store = useStore<State>();

    const signalProvider = useMemo(() => new SignalManager(store as Store<State>), []);

    const main = useCallback(async () => {
        await signalProvider.Connect("ws://127.0.0.1:6126");
    }, [signalProvider]);

    useEffect(() => {
        main().finally();
    }, [main]);

    return <Context.Provider value={{ value: signalProvider }}>
        {props.children}
    </Context.Provider>;
};

export const useGameSignal: () => SignalManager = () => (React.useContext(Context) as GameSignalContext).value;
