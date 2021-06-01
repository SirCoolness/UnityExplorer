import React from "react";
import { CombinedRedux } from "../Context/CombinedRedux";
import { GameSignalContextProvider } from "../Context/GameSignalContext";

const contextProviders: Array<React.FC> = [
    CombinedRedux,
    GameSignalContextProvider
];

export const GlobalContext: React.FC = props => <React.Fragment>
    {contextProviders.reduceRight((memo, ContextProvider) => {
        return <ContextProvider>{memo}</ContextProvider>;
    }, props.children)}
</React.Fragment>;
