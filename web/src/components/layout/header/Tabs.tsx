import React, { ReactNode } from "react";
import { StaticQuery, graphql } from "gatsby";

import { Tab } from "./Header";

interface State {}
export interface Props {
  navTabs: any[];
  formatTabs(sm: boolean, navTabs: Tab[]): ReactNode;
}
interface Edge {
  node: {
    name: string;
    publicURL: string;
  };
}

export default class Tabs extends React.Component<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);
  }

  public render() {
    return (
      <StaticQuery
        query={graphql`
          query Assets {
            allFile {
              edges {
                node {
                  publicURL
                  name
                }
              }
            }
          }
        `}
        render={({ allFile: { edges } }: { allFile: { edges: Edge[] } }) => (
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0">
              <img
                className="block lg:hidden h-8 w-auto"
                src={edges.find((e: Edge) => e.node.name === "logo")?.node.publicURL}
                alt="Logo"
              />
              <img
                className="hidden lg:block h-8 w-auto"
                src={edges.find((e: Edge) => e.node.name === "logo")?.node.publicURL}
                alt="Logo"
              />
            </div>
            <div className="hidden sm:block sm:ml-6">
              <div className="flex">{this.props.formatTabs(false, this.props.navTabs)}</div>
            </div>
          </div>
        )}
      />
    );
  }
}
