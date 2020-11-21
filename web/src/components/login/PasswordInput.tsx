import React, { ChangeEvent } from "react";

import TextInput from "../forms/Input";

interface State {}
interface Props {
  password: string;
  error?: string;
  onChange(e: ChangeEvent<HTMLInputElement>): void;
}

export default class PasswordInput extends React.Component<Props, State> {
  public render() {
    return (
      <>
        <label className="block text-sm font-bold mb-2" htmlFor="password">
          Password
        </label>
        <TextInput
          className="mb-3"
          id="password"
          type="password"
          name="password"
          placeholder="************"
          value={this.props.password}
          onChange={this.props.onChange}
        />
        {this.props.error && <p className="text-red-500 text-xs italic">{this.props.error}</p>}
      </>
    );
  }
}
