import React, {useMemo} from "react";
import {InitStore} from "../../Store/Store";
import { Provider as ReduxProvider } from 'react-redux';

export const ReduxContext: React.FC = props => {
    const store = useMemo(InitStore, []);

    return <ReduxProvider store={store}>
        {props.children}
    </ReduxProvider>;
}
