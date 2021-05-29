import React from "react";

import { GameConnectionContextProvider } from "./Redux/GameConnection";

const contextProviders: Array<React.FC> = [
    GameConnectionContextProvider
];

export const CombinedRedux: React.FC = props => <React.Fragment>
    {contextProviders.reduceRight((memo, ContextProvider) => {
        return <ContextProvider>{memo}</ContextProvider>;
    }, props.children)}
</React.Fragment>;
