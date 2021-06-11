import {CreateMethodHandle} from "../../Utils/CreateMethodHandle";
import {game} from "../../../generated/Buffs";

export const sceneFind = CreateMethodHandle(game.Scene, "sceneFind")((game, request) => async (dispatch, getState) => {
    return {
        instanceID: 123,
        name: "asdf",
        root: 123
    }
});
