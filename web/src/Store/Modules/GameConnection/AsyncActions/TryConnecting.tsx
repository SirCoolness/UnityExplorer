import {ThunkAction} from "../../../../types/utils";
import {Actions} from "../Actions";

export const TryConnecting: ThunkAction<string> = args => async (dispatch, getState) => {
    dispatch(Actions.Connect.request(args));

    const ws = new WebSocket(args);

    await new Promise<void>((resolve, reject) => {
        const bindings = {
            cleanup: () => {
                ws.removeEventListener("open", bindings.onConnect);
                ws.removeEventListener("error", bindings.onError);
            },
            onConnect: () => {
                bindings.cleanup();

                dispatch(Actions.Connect.success(ws));

                resolve();
            },
            onError: (e: Event) => {
                bindings.cleanup();

                const error = new Error("Failed to connect.");
                dispatch(Actions.Connect.failure(error));

                resolve();
            }
        };

        ws.addEventListener("open", bindings.onConnect);
        ws.addEventListener("error", bindings.onError);
    });
}
