import React, { ChangeEvent } from "react";

import TextInput from "../forms/Input";

interface State {}
interface Props {
  username: string;
  error?: string;
  onChange(e: ChangeEvent<HTMLInputElement>): void;
}

export default class UsernameInput extends React.Component<Props, State> {
  public render() {
    return (
      <>
        <label className="block text-sm font-bold mb-2" htmlFor="username">
          Username
        </label>
        <TextInput
          className="mb-3"
          id="username"
          type="text"
          name="username"
          placeholder="Username"
          value={this.props.username}
          onChange={this.props.onChange}
        />
        {this.props.error && <p className="text-red-500 text-xs italic">{this.props.error}</p>}
      </>
    );
  }
}
