import React, {useEffect} from "react";

import styles from './Main.scss';
import {Writer} from "protobufjs";
import {PingRequest} from "../../generated/bi/ping";

export const Main: React.FC = () => {
    useEffect(() => {
        const ws = new WebSocket("ws://127.0.0.1:6126");
        ws.addEventListener("open", () => {
            console.log("connected");

            const writer = new Writer();

            writer.sfixed32(0);
            writer.bool(true);
            PingRequest.encode({
                message: "beans"
            }, writer);

            function i2hex(i: number) {
                return ('0' + i.toString(16)).slice(-2);
            }

            const res = writer.finish();
            console.log("sending", Array.from(res).map(i2hex).join(' '));
            ws.send(res);
        });
        ws.addEventListener("close", () => {
            console.log("disconnected");
        });
    }, []);

    return <div className={styles.root}>
        works
    </div>;
}
