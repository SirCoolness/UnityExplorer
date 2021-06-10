import React from "react";
import { Props as RNDProps } from "react-rnd";

export type WindowDefaultSizing = {
    width?: number;
    height?: number;
};

export type WindowProps = {};

export type WindowComponent<Props = {}> = React.FC<WindowProps & Props> & {
    defaultSize?: WindowDefaultSizing;
};
