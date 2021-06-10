import {WindowComponent} from "../../../types/windows/Window";
import {MakeWindow} from "../../Modules/WindowBase/MakeWindow";
import {
    Button,
    CardActions,
    CardContent,
    CardHeader,
    Checkbox,
    Divider,
    Grid,
    makeStyles,
    Typography
} from "@material-ui/core";
import {TreeItem, TreeView} from "@material-ui/lab";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import GameObjectLabel from "./GameObjectLabel";

const useStyles = makeStyles((theme) => ({
    title: {
        ...theme.typography.subtitle2
    }
}))

const SceneView: WindowComponent = () => {
    const styles = useStyles();

    return <>
        <CardHeader
            title="Scene Explorer"
            titleTypographyProps={{
                className: styles.title
            }}
        />
        <Divider />
        <CardContent>
            <TreeView
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                multiSelect
            >
                <TreeItem nodeId='1' label={<GameObjectLabel label="foo" />}>
                    <TreeItem nodeId='2' label={<GameObjectLabel label="bar" />} />
                </TreeItem>
            </TreeView>
        </CardContent>
    </>;
}

SceneView.defaultSize = {
    width: 6,
    height: 18
}

export default MakeWindow(SceneView);
