import React from "react";
import {Rnd} from "react-rnd";
import {makeStyles, Paper, useTheme} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        transition: [
            "width",
            "height",
            "transform"
        ].map(item =>
            `${item} ease-out ${(theme.transitions.duration.shortest / 3) * 2}ms`
        ).join(", ")
    },
    paper: {
        width: '100%',
        height: '100%'
    }
}))

export const WindowBase: React.FC = props => {
    const theme = useTheme();
    const styles = useStyles();

    return <Rnd
        className={styles.root}
        bounds="parent"
        default={{
            height: theme.spacing(24),
            width: theme.spacing(24),
            x: 0,
            y: 0
        }}
        dragGrid={[theme.spacing(6), theme.spacing(6)]}
        resizeGrid={[theme.spacing(6), theme.spacing(6)]}
    >
        <Paper className={styles.paper} elevation={1}>
            {props.children}
        </Paper>
    </Rnd>;
}
