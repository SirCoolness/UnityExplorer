import React, {useEffect} from "react";

import styles from './Main.scss';
import {Reader, Writer, Long as ProtoLong} from "protobufjs";
import {PingRequest} from "../../generated/bi/ping";

export const Main: React.FC = () => {
    useEffect(() => {
        const ws = new WebSocket("ws://127.0.0.1:6126");
        ws.addEventListener("open", () => {
            console.log("connected");

            const writer = new Writer();

            writer.sfixed32(0);
            writer.bool(true);
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

        ws.addEventListener("message", e => {
            const reader = new Reader(e.data);

            const commandId = reader.sfixed32();
            const hasTracker = reader.bool();
            const tracker = hasTracker ? reader.sfixed32() : 0;
            const hasData = reader.bool();

            console.log(`${commandId} ${hasTracker} ${tracker} ${hasData}`)
        });

        ws.addEventListener("close", () => {
            console.log("disconnected");
        });
    }, []);

    return <div className={styles.root}>
        works
    </div>;
}
