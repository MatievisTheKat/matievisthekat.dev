import React from "react";

interface State {}
interface Props extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {}

export default class TextInput extends React.Component<Props, State> {
  public render() {
    return (
      <input
        id={this.props.id}
        dir={this.props.dir}
        type={this.props.type}
        className={`py-2 px-3 w-full max-w-xs shadow appearance-none border rounded leading-tight focus:outline-none focus:shadow-outline ${this.props.className}`}
        value={this.props.value}
        placeholder={this.props.placeholder}
        onChange={this.props.onChange}
      />
    );
  }
}
