import React from "react";
import Meta from "./Meta";

export default class Head extends React.Component {
  render() {
    return (
      <head>
        <Meta title={this.props.title} />
        <title>{this.props.title}</title>

        <link rel="stylesheet" href="assets/css/global.css" />
        <link rel="shortcut icon" href="/assets/images/favicon.ico" type="image/x-icon" />
      </head>
    );
  }
}
