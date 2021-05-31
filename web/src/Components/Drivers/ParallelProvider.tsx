import React from "react";
import {GameConnection} from "../Parallel/GameConnection";

const parallelProviders: Array<React.FC> = [
    GameConnection
];

export const ParallelProvider: React.FC = props => <React.Fragment>
    {parallelProviders.map((ParallelEl) => <ParallelEl key={ParallelEl.name} />)}
</React.Fragment>;
