import React, {useEffect, useState} from "react";

import styles from './Main.scss';
import {Reader, Writer, Long as ProtoLong} from "protobufjs";
import {PingRequest} from "../../generated/bi/ping";
import {useGameConnectionContext} from "../Context/Redux/GameConnection";
import {useGameSignal} from "../Context/GameSignalContext";

export const Main: React.FC = () => {
    const { state } = useGameConnectionContext();
    const { Mutation } = useGameSignal();
    const [pingResponse, setPingResponse] = useState<string>();

    return <div className={styles.root}>
        { state.error && <>
            <span>{state.error.message}</span>
            <br/>
        </>}
        <span>{state.connected ? "connected" : state.isConnecting ? "connecting" : "not connected"}</span>
        <br/>
        {state.connected && <button onClick={() => {
            Mutation(new PingRequest({
                message: "Beans"
            })).then(data => setPingResponse(data.message as string))
        }
        }>ping</button> }
        { pingResponse && <>
            <br/>
            <span>Server Responded with: {pingResponse}</span>
        </>}
    </div>;
}
