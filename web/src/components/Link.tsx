import React from "react";
import { Link as GatsbyLink, GatsbyLinkProps } from "gatsby";

interface State {}
interface Props extends GatsbyLinkProps<State> {
  external?: boolean;
  title?: string;
}

export default class Link extends React.Component<Props, State> {
  public render() {
    return this.props.external ? (
      <a
        href={this.props.to}
        title={this.props.title || ""}
        rel="noreferrer"
        target="_blank"
        className={`hover:underline italic text-current ${this.props.className}`}
      >
        {this.props.children}
      </a>
    ) : (
      <GatsbyLink to={this.props.to} className={`hover:underline italic text-current ${this.props.className}`}>
        {this.props.children}
      </GatsbyLink>
    );
  }
}
