import React from "react";

import Button from "../Button";

import { User } from "../../../types";

interface State {}
interface Props {
  username: string;
  login(): void;
  resetRemembered(user?: User, jwt?: string): void;
}

export default class RememberedLogin extends React.Component<Props, State> {
  public render() {
    return (
      <div className="text-center">
        <h1>We remember you! Would you like to continue as {this.props.username}?</h1>
        <div className="mt-3">
          <Button colour="blue" className="mx-1" onClick={(e) => this.props.login()}>
            Yes
          </Button>
          <Button colour="red" className="mx-1" onClick={(e) => this.props.resetRemembered()}>
            No
          </Button>
        </div>
      </div>
    );
  }
}
