import React, { ReactNode } from "react";

import { httpPairs, HTTPStatusCode } from "../../types";

import Link from "./Link";

interface State {}
interface Props {
  code?: HTTPStatusCode;
  children: ReactNode;
}

export default class Error extends React.Component<Props, State> {
  public render() {
    return (
      <div className="container text-center">
        <h1 className="text-center text-4xl text-shadow-grey-light font-nunito">{this.props.code || "ERR"}</h1>
        <p className="text-center text-l mb-6 font-mono">
          {this.props.code ? httpPairs[this.props.code] : "Unknown error"}
          <Link to={`/http-status-definition?code=${this.props.code}`} className="ml-2 text-blue-400">
            (?)
          </Link>
        </p>
        <div className="container text-center mt-3">{this.props.children}</div>
      </div>
    );
  }
}
