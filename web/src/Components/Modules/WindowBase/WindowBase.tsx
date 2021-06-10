import React, {useMemo} from "react";
import {Rnd} from "react-rnd";
import {makeStyles, Paper, useTheme} from "@material-ui/core";
import {WindowComponent} from "../../../types/windows/Window";
import { Props as RNDProps } from "react-rnd";

type Props = {
    window: WindowComponent;
};

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

const WindowBase: React.FC<Props> = props => {
    const theme = useTheme();
    const styles = useStyles();

    const defaultSize = useMemo<RNDProps['default']>(() => {
        const baseUnit = theme.spacing(6);

        return {
            x: 0,
            y: 0,
            width: (props.window.defaultSize?.width || 4) * baseUnit,
            height: (props.window.defaultSize?.height || 4) * baseUnit,
        };
    }, [theme.spacing, props.window]);

    return <Rnd
        className={styles.root}
        bounds="parent"
        default={defaultSize}
        dragGrid={[theme.spacing(6), theme.spacing(6)]}
        resizeGrid={[theme.spacing(6), theme.spacing(6)]}
    >
        <Paper className={styles.paper} elevation={1}>
            {props.children}
        </Paper>
    </Rnd>;
}

export default WindowBase;
