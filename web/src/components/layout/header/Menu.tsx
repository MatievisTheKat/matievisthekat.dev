import React from "react";

import BurgerSvg from "../../svg/Burger";
import CrossSvg from "../../svg/Cross";

interface State {}
interface Props {
  setOpen(menuOpen?: boolean): void;
  open: boolean;
}

export default class Menu extends React.Component<Props, State> {
  public render() {
    return (
      <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
        <button
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white transition duration-150 ease-in-out"
          aria-label="Main menu"
          aria-expanded={this.props.open}
          onClick={() => this.props.setOpen()}
        >
          <CrossSvg className={`${this.props.open ? "hidden" : "block"} h-6 w-6`} />
          <BurgerSvg className={`${this.props.open ? "block" : "hidden"} h-6 w-6`} />
        </button>
      </div>
    );
  }
}
