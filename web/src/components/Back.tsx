import React from "react";

interface State {}
interface Props {
  className?: string;
}

export default class Back extends React.Component<Props, State> {
  public render() {
    return (
      <a href="#back" onClick={() => window.history.back()} className={`text-blue-400 hover:underline italic ${this.props.className}`}>
        {this.props.children || "Back"}
      </a>
    );
  }
}
