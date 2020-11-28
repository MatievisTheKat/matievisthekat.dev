import React, { ChangeEvent } from "react";

import TextInput from "./TextInput";

interface State {}
interface Props {
  value: string;
  label?: string;
  error?: string;
  className?: string;
  onChange(e: ChangeEvent<HTMLInputElement>): void;
}

export default class PasswordInput extends React.Component<Props, State> {
  public render() {
    return (
      <div className={this.props.className}>
        <label className="block text-sm font-bold mb-2" htmlFor="password">
          {this.props.label || "Password"}
        </label>
        <TextInput
          className="mb-1"
          type="password"
          name="password"
          placeholder="************"
          value={this.props.value}
          onChange={this.props.onChange}
        />
        {this.props.error && <p className="text-red-500 text-xs italic">{this.props.error}</p>}
      </div>
    );
  }
}
