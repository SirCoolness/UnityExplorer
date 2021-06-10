import React from "react";

import MainUI from "../Pages/MainUI/MainUI";
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    "@global": {
        "html, body, #root": {
            width: "100%",
            height: "100%"
        },
        "body": {
            margin: 0
        }
    },
    root: {
        width: "100%",
        minHeight: "100%",
        display: "flex",
        flexFlow: "column",
        "& > *": {
            flexShrink: 0
        }
    }
}))

export const Main: React.FC = () => {
    const styles = useStyles();
    return <div className={styles.root}>
        <MainUI />
    </div>
}
