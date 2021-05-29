import React, {useMemo} from "react";

import {CommandRequest, CommandResponse} from "../../generated/core/command";
import styles from './Main.scss';
import {PingRequest} from "../../generated/bi/ping";

export const Main: React.FC = () => {
    const res = useMemo(() => CommandRequest.encode({
        tracker: 1,
        dataId: PingRequest.op
    }))
    return <div className={styles.root}>
        works
    </div>;
}
