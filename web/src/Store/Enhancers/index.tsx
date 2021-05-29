import {BuildMiddleware} from "./Middleware";

export const InitEnhancers = () => {
    return [BuildMiddleware()];
}
