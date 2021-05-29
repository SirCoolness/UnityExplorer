import {Handlers} from "./index";
import {getType} from "typesafe-actions";
import {Actions} from "../Actions";

const Connect: Handlers = {};

Connect[getType(Actions.Connect.request)] = (state, { payload }) => ({
    ...state,

})

export { Connect };
