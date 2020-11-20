import React from "react";

interface State {}
interface Props {
  className?: string;
}

export default class Box extends React.Component<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);
  }

  public render() {
    return <div className={`w-full max-w-md mx-auto bg-gray-200 shadow-md rounded p-4 ${this.props.className}`}>{this.props.children}</div>;
  }
}
