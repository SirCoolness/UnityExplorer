import React from "react";
import {ReduxContext} from "./ReduxContext";
import {GlobalContext} from "./GlobalContext";

export const DriversAdapter: React.FC = props => <ReduxContext>
    <GlobalContext>
        {props.children}
    </GlobalContext>
</ReduxContext>
