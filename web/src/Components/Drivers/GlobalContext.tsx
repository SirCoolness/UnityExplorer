import React from "react";
import { CombinedRedux } from "../Context/CombinedRedux";

const contextProviders: Array<React.FC> = [
    CombinedRedux
];

export const GlobalContext: React.FC = props => <React.Fragment>
    {contextProviders.reduceRight((memo, ContextProvider) => {
        return <ContextProvider>{memo}</ContextProvider>;
    }, props.children)}
</React.Fragment>;
