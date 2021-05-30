import React, {useEffect} from "react";

import styles from './Main.scss';

export const Main: React.FC = () => {
    useEffect(() => {
        const ws = new WebSocket("ws://127.0.0.1:6126");
        ws.addEventListener("open", () => {
            console.log("connected");
            ws.send("asdf");
        });
        ws.addEventListener("close", () => {
            console.log("disconnected");
        });
    }, []);

    return <div className={styles.root}>
        works
    </div>;
}
