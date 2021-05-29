import { applyMiddleware, Middleware } from 'redux';

import thunk from 'redux-thunk';
import {Log} from "../Middleware/Log";

export const BuildMiddleware = () => {
    const middleware = [thunk as Middleware];

    middleware.push(Log);

    return applyMiddleware(...middleware);
}
