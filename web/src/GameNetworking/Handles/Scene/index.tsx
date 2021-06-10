import {CreateRPCService} from "../../Utils/CreateRPCService";
import {CreateMethodHandle} from "../../Utils/CreateMethodHandle";
import {game} from "../../../generated/Buffs";

const test = CreateMethodHandle(game.Scene, "sceneFind")(async (request) => {
    return {
        instanceID: 123,
        name: "asdf",
        root: 123
    }
});

export default CreateRPCService({});
