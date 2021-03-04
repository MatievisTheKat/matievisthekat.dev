import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";

interface State {
  show: boolean;
}
interface Props extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {}

export default class TextInput extends React.Component<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);

    this.state = {
      show: false,
    };
  }

  set show(show: boolean) {
    this.setState({ show });
  }

  public render() {
    this.props.className;
    return (
      <div className="max-w-xs mx-auto relative">
        <input
          {...this.props}
          type={this.props.type === "password" && this.state.show ? "text" : this.props.type}
          className={`py-2 px-3 w-full shadow appearance-none border rounded leading-tight focus:outline-none focus:shadow-outline ${this.props.className}`}
        />

        {this.props.type === "password" ? (
          <div
            className="absolute inset-y-0 right-0 pr-3 -mt-1 flex items-center text-sm leading-5 hover:pointer"
            onClick={() => (this.show = !this.state.show)}
          >
            <FontAwesomeIcon icon={this.state.show ? faEye : faEyeSlash} className="h-6 text-gray-700" />
          </div>
        ) : null}
      </div>
    );
  }
}
