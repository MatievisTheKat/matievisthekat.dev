import React from "react";

import { Props as TabProps } from "./Tabs";

interface State {}
interface Props extends TabProps {
  menuOpen: boolean;
}

export default class NavBar extends React.Component<Props, State> {
  public render() {
    return (
      <nav
        className="bg-gray-800"
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">{this.props.children}</div>
        </div>

        <div className={`${this.props.menuOpen ? "block" : "hidden"} sm:hidden`}>
          <div className="px-2 pt-2 pb-3">{this.props.formatTabs(true, this.props.navTabs)}</div>
        </div>
      </nav>
    );
  }
}
