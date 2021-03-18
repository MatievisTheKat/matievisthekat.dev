import React from "react";
import { BarLoader as RSBarLoader } from "react-spinners";
import { BaseLoaderProps } from "../../../types";

interface State {}
interface Props extends BaseLoaderProps {
  height?: string | number;
  width?: string | number;
}

export default class BarLoader extends React.Component<Props, State> {
  static defaultProps = {
    colour: "#64B5F6",
    width: NaN,
  };

  public render() {
    return <RSBarLoader color={this.props.colour} loading={this.props.loading} width={this.props.width} height={this.props.height} />;
  }
}
