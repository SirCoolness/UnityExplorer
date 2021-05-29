import { compose } from 'redux';

export const ComposeEnhancers =
    typeof window === 'object' &&
    //@ts-ignore
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? //
          //@ts-ignore
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
        : compose;
