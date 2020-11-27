import React from "react";

interface State {}
interface Props {
  className?: string;
}

export default class CrossSvg extends React.Component<Props, State> {
  public render() {
    return (
      <svg className={this.props.className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    );
  }
}
