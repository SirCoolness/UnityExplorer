import React from "react";
import {Button, Checkbox, Grid, Typography} from "@material-ui/core";

type Props = {
    label: string;
};

const GameObjectLabel: React.FC<Props> = props => {
    return <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
    >
        <Grid item>
            <Grid container alignItems="center" justify="center" direction="row">
                <Checkbox onClick={e => e.stopPropagation()} />
                <Typography>{props.label}</Typography>
            </Grid>
        </Grid>
        <Grid item>
            <Grid container alignItems="center" justify="center" direction="row">
                <Button
                    size="small"
                    onClick={e => e.stopPropagation()}
                >Inspect</Button>
            </Grid>
        </Grid>
    </Grid>;
};

export default GameObjectLabel;
