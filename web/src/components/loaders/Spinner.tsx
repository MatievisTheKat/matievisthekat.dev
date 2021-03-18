import React from "react";
import { MoonLoader } from "react-spinners";
import { BaseLoaderProps } from "../../../types";

interface State {}
interface Props extends BaseLoaderProps {
  size?: string | number;
}

export default class SpinLoader extends React.Component<Props, State> {
  static defaultProps = {
    colour: "#64B5F6",
  };

  public render() {
    return <MoonLoader color={this.props.colour} loading={this.props.loading} css={this.props.css} size={this.props.size} />;
  }
}
