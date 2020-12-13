import React, { ChangeEvent } from "react";

import TextInput from "./TextInput";

interface State {}
interface Props {
  value: string;
  label: string;
  showLabel?: boolean;
  error?: string;
  className?: string;
  onChange(e: ChangeEvent<HTMLInputElement>): void;
}

export default class UsernameInput extends React.Component<Props, State> {
  static defaultProps = {
    label: "Username",
    showLabel: true,
  };

  public render() {
    return (
      <div className={this.props.className}>
        {this.props.showLabel && (
          <label className="block text-sm font-bold mb-2" htmlFor="username">
            {this.props.label}
          </label>
        )}
        <TextInput className="mb-1" type="text" name="username" placeholder="Username" value={this.props.value} onChange={this.props.onChange} />
        {this.props.error && <p className="text-red-500 text-xs italic">{this.props.error}</p>}
      </div>
    );
  }
}
