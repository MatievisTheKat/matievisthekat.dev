import React from "react";
import { StaticQuery, graphql } from "gatsby";

import Header from "./header/Header";

interface State {}
interface Props {
  tab?: string;
}

export default class Layout extends React.Component<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);
  }

  public render() {
    const toSlug = (str: string) => str.trim().replace(/\//gi, "-").toLowerCase();

    return (
      <StaticQuery
        query={graphql`
          query SiteTitleQuery {
            site {
              siteMetadata {
                title
              }
            }
          }
        `}
        render={({ site }) => {
          const tab = this.props.tab ? toSlug(this.props.tab) : toSlug(window.location.pathname.slice(1));
          return (
            <>
              <Header title={site.siteMetadata?.title} tab={tab} />
              <main className="lg:mx-16 my-10 text-cente place-content-center">{this.props.children}</main>
            </>
          );
        }}
      />
    );
  }
}
