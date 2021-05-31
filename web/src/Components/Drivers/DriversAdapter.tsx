import React from "react";
import {ReduxContext} from "./ReduxContext";
import {GlobalContext} from "./GlobalContext";
import {ParallelProvider} from "./ParallelProvider";

export const DriversAdapter: React.FC = props => <ReduxContext>
    <GlobalContext>
        <ParallelProvider />
        {props.children}
    </GlobalContext>
</ReduxContext>
