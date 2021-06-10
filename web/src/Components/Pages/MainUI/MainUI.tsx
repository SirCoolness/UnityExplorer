import React from "react";

import {Rnd} from "react-rnd";

import {makeStyles, Paper, useTheme} from "@material-ui/core";
import {WindowBase} from "../../Modules/WindowBase/WindowBase";

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

export const MainUI: React.FC = () => {
    const styles = useStyles();

    return <div className={styles.root}>
        <div className={styles.content}>
            {[0, 1].map(item => <WindowBase key={item}>{item}</WindowBase>)}
        </div>
    </div>
}
