import React from "react";

interface State {}
interface Props extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  loading?: boolean;
  colour?: string;
  colourDarkness: number;
  padding: PaddingSize;
}
type PaddingSize = "lg" | "md" | "sm" | string;

export default class Button extends React.Component<Props, State> {
  static defaultProps = {
    colourDarkness: 500,
    colour: "blue",
    padding: "lg",
  };

  public render() {
    const colourDarkness = this.props.colourDarkness;
    const paddings: Record<PaddingSize, string> = {
      lg: "py-2 px-4",
      md: "py-2 px-3",
      sm: "py-1 px-2",
    };

    return (
      <button
        type={this.props.type}
        onClick={(e) => {
          if (!this.props.disabled && this.props.onClick) this.props.onClick(e);
        }}
        className={`bg-${this.props.colour}-${colourDarkness} text-white font-bold rounded shadow ${paddings[this.props.padding] || this.props.padding} ${
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
