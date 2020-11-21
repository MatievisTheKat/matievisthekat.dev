import React from "react";

interface State {}
interface Props extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  loading?: boolean;
  colour?: string;
  colourDarkness?: number;
}

export default class Button extends React.Component<Props, State> {
  public render() {
    const colourDarkness = this.props.colourDarkness ?? 500;

    return (
      <button
        type={this.props.type}
        onClick={(e) => {
          if (!this.props.disabled && this.props.onClick) this.props.onClick(e);
        }}
        className={`bg-${this.props.colour}-${colourDarkness} text-white font-bold py-2 px-4 rounded ${
          this.props.disabled
            ? "opacity-50 cursor-not-allowed"
            : `focus:outline-none focus:shadow-outline hover:bg-${this.props.colour}-${colourDarkness + 200}`
        } ${this.props.className}`}
      >
        {this.props.children}
      </button>
    );
  }
}
