import React from "react";
import { ScaleLoader as RSScaleLoader } from "react-spinners";
import { BaseLoaderProps } from "../../../types";

interface State {}
interface Props extends BaseLoaderProps {
  radius?: number | string;
  margin?: number | string;
  height?: number | string;
  width?: number | string;
}

export default class ScaleLoader extends React.Component<Props, State> {
  static defaultProps = {
    colour: "#64B5F6",
  };

  public render() {
    return (
      <RSScaleLoader
        css={this.props.css}
        color={this.props.colour}
        loading={this.props.loading}
        radius={this.props.radius}
        margin={this.props.margin}
        height={this.props.height}
        width={this.props.width}
      />
    );
  }
}
