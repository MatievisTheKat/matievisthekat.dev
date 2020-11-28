import React from "react";

interface State {}
interface Props {
  className?: string;
}

export default class Box extends React.Component<Props, State> {
  public render() {
    return <div className={`w-full max-w-lg mx-auto bg-gray-100 shadow-md rounded p-4 ${this.props.className}`}>{this.props.children}</div>;
  }
}
