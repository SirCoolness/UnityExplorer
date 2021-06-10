import React from "react";
import {WindowComponent} from "../../../types/windows/Window";
import WindowBase from "./WindowBase";

export const MakeWindow: (Component: WindowComponent) => React.FC = Component => {
    return () => {
        return <WindowBase window={Component}>
            <Component />
        </WindowBase>
    }
}
