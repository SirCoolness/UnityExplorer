import {WindowComponent} from "../../../types/windows/Window";
import {MakeWindow} from "../../Modules/WindowBase/MakeWindow";

const SceneView: WindowComponent = () => {
    return <div>
        scene view
    </div>;
}

SceneView.defaultSize = {
    width: 6,
    height: 18
}

export default MakeWindow(SceneView);
