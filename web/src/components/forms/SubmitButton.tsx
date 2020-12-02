import React from "react";

import Button from "../Button";
import SpinLoader from "../loaders/Spinner";

interface State {}
interface Props {
  loading: boolean;
  label?: string;
  error?: boolean;
  className?: string;
}

export default class SubmitButton extends React.Component<Props, State> {
  public render() {
    return (
      <Button colour="blue" disabled={this.props.error || this.props.loading} type="submit" className={this.props.className}>
        {this.props.loading && <SpinLoader size={20} colour="white" />}
        {!this.props.loading && (this.props.label || "Submit")}
      </Button>
    );
  }
}
