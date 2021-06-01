import React from "react";

const parallelProviders: Array<React.FC> = [];

export const ParallelProvider: React.FC = props => <React.Fragment>
    {parallelProviders.map((ParallelEl) => <ParallelEl key={ParallelEl.name} />)}
</React.Fragment>;
