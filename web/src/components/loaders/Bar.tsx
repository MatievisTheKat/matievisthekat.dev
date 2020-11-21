import React from "react";
import { BarLoader as RSBarLoader } from "react-spinners";
import { BaseLoaderProps } from "../../../types";

interface State {}
interface Props extends BaseLoaderProps {
  height?: string | number;
  width?: string | number;
}

export default class BarLoader extends React.Component<Props, State> {
  public render() {
    return (
      <RSBarLoader
        color={this.props.colour || "blue"}
        loading={this.props.loading}
        width={this.props.width}
        height={this.props.height}
      />
    );
  }
}
