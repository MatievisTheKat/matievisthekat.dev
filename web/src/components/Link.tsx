import React from "react";
import { Link as GatsbyLink, GatsbyLinkProps } from "gatsby";

interface State {}
interface Props extends GatsbyLinkProps<State> {}

export default class Link extends React.Component<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);
  }

  public render() {
    return (
      <GatsbyLink to={this.props.to} className={`text-blue-400 hover:underline italic ${this.props.className}`}>
        {this.props.children}
      </GatsbyLink>
    );
  }
}
