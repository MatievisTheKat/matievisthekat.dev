import React, { ReactNode } from "react";

import { Tab } from "./Header";

interface State {}
export interface Props {
  navTabs: any[];
  formatTabs(sm: boolean, navTabs: Tab[]): ReactNode;
}

export default class Tabs extends React.Component<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);
  }

  public render() {
    return (
      <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
        <div className="flex-shrink-0">
          <img
            className="block lg:hidden h-8 w-auto"
            src="https://tailwindui.com/img/logos/workflow-mark-on-dark.svg"
            alt="Workflow logo"
          />
          <img
            className="hidden lg:block h-8 w-auto"
            src="https://tailwindui.com/img/logos/workflow-logo-on-dark.svg"
            alt="Workflow logo"
          />
        </div>
        <div className="hidden sm:block sm:ml-6">
          <div className="flex">{this.props.formatTabs(false, this.props.navTabs)}</div>
        </div>
      </div>
    );
  }
}
