import React, { ReactNode } from "react";
import { StaticQuery, graphql } from "gatsby";

import { Tab } from "../../../../types";

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

const AssetsQuery = graphql`
  query AssetsQuery {
    allFile {
      edges {
        node {
          publicURL
          name
        }
      }
    }
  }
`;

export default class Tabs extends React.Component<Props, State> {
  public render() {
    return (
      <StaticQuery
        query={AssetsQuery}
        render={({ allFile: { edges } }: { allFile: { edges: Edge[] } }) => {
          const src = edges.find((e: Edge) => e.node.name === "logo" && e.node.publicURL.endsWith(".webp"))?.node.publicURL;

          return (
            <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex-shrink-0">
                <img className="block lg:hidden h-8 w-auto" src={src} alt="Logo" />
                <img className="hidden lg:block h-8 w-auto" src={src} alt="Logo" />
              </div>
              <div className="hidden sm:block sm:ml-6">
                <div className="flex">{this.props.formatTabs(false, this.props.navTabs)}</div>
              </div>
            </div>
          );
        }}
      />
    );
  }
}
