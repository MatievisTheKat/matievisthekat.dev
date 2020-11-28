import React from "react";

interface State {}
interface Props extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  border?: boolean;
}

export default class UserAvatar extends React.Component<Props, State> {
  public render() {
    return (
      <img
        src={`${process.env.API}${this.props.src}`}
        alt="User avatar"
        className={`w-${this.props.width || "1/6"} ${this.props.border !== false ? "border-gray-500 border-2" : ""} border-radius-1/2 ${
          this.props.className
        }`}
        onClick={this.props.onClick}
      />
    );
  }
}
