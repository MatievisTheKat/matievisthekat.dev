import React from "react";

interface State {}
interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {}

export default class ClickableText extends React.Component<Props, State> {
  public render() {
    return (
      <span {...this.props} className="italic font-bold text-blue-500 hover:text-blue-600 hover:pointer">
        {this.props.children}
      </span>
    );
  }
}
