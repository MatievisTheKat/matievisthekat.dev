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

export default class EmailInput extends React.Component<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);
  }

  public render() {
    return (
      <div className={this.props.className}>
        <label className="block text-sm font-bold mb-2" htmlFor="email">
          {this.props.label || "Email"}
        </label>
        <TextInput
          className="mb-1"
          type="email"
          name="email"
          placeholder="admin@example.com"
          value={this.props.value}
          onChange={this.props.onChange}
        />
        {this.props.error && <p className="text-red-500 text-xs italic">{this.props.error}</p>}
      </div>
    );
  }
}
