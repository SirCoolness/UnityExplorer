import React from "react";

import { makeStyles } from "@material-ui/core";

import SceneView from "../../Windows/SceneView/SceneView";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        height: '100%',
        boxSizing: "border-box",
        padding: theme.spacing(2),
        backgroundColor: theme.palette.background.default,
        display: "flex",
        flexFlow: "column"
    },
    content: {
        flexGrow: 1,
        width: '100%',
        height: '100%'
    }
}));

const MainUI: React.FC = () => {
    const styles = useStyles();

    return <div className={styles.root}>
        <div className={styles.content}>
            <SceneView />
        </div>
    </div>
}

export default MainUI;
