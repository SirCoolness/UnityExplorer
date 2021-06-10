import React from "react";
import {Typography, Toolbar as MatToolbar } from "@material-ui/core";

const Toolbar: React.FC = () => {
    return <MatToolbar>
        <Typography variant="h6">Unity Explorer</Typography>
    </MatToolbar>;
}

export default Toolbar;
