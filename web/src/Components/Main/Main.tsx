import React from "react";

import styles from './Main.scss';
// import {PingRequest, PingResponse} from "../../generated/bi/ping";
// import {useGameConnectionContext} from "../Context/Redux/GameConnection";
// import {useGameSignal} from "../Context/GameSignalContext";
// import {IWebGameObject, SceneResponse} from "../../generated/client/scene";
//
// export const Main: React.FC = () => {
//     const { state } = useGameConnectionContext();
//     const { Mutation } = useGameSignal();
//     const [pingResponse, setPingResponse] = useState<string>();
//     const [sceneItems, setSceneItems] = useState<IWebGameObject[]>([]);
//
//     const getScene = useCallback(async () => {}, []);
//
//     return <div className={styles.root}>
//         { state.error && <>
//             <span>{state.error.message}</span>
//             <br/>
//         </>}
//         <span>{state.connected ? "connected" : state.isConnecting ? "connecting" : "not connected"}</span>
//         <br/>
//         {state.connected && <>
//             <button onClick={() => {
//                 Mutation(new PingRequest({
//                     message: "Beans"
//                 })).then(data => setPingResponse((data as PingResponse).message as string))
//             }
//             }>ping</button>
//             <button onClick={() => {
//                 Mutation(new SceneResponse()).then(data => setSceneItems((data as SceneResponse).gameobjects))
//             }
//             }>getScene</button>
//         </> }
//         { pingResponse && <>
//             <br/>
//             <span>Server Responded with: {pingResponse}</span>
//             <br/>
//         </>}
//         {sceneItems.map(item => <>
//             <span>{item.name}</span><input type="checkbox" value={item.enabled as any} />
//             <br/>
//         </>)}
//     </div>;
// }

export const Main: React.FC = () => {
    return <div className={styles.root}>
        main
    </div>
}
