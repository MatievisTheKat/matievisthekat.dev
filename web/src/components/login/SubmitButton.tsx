import React from "react";
import Button from "../Button";
import SpinLoader from "../loaders/Spinner";

interface State {}
interface Props {
  loading: boolean;
  passwordErr?: boolean;
  usernameErr?: boolean;
}

export default class SubmitButton extends React.Component<Props, State> {
  public render() {
    return (
      <Button colour="blue" disabled={this.props.passwordErr || this.props.usernameErr || this.props.loading} type="submit">
        <SpinLoader size={20} colour="white" loading={this.props.loading} />
        {!this.props.loading && "Login"}
      </Button>
    );
  }
}
