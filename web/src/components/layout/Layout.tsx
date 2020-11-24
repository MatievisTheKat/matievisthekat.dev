import React from "react";
import { StaticQuery, graphql } from "gatsby";

import Header from "./header/Header";
import Footer from "./Footer";

interface State {}
interface Props {
  tab?: string;
}

export default class Layout extends React.Component<Props, State> {
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
            <div className="flex flex-col h-screen justify-between">
              <Header title={site.siteMetadata?.title} tab={tab} />
              <main className="mb-auto lg:mx-10 mt-10 text-center text-gray-700 place-content-center">{this.props.children}</main>
              <Footer />
            </div>
          );
        }}
      />
    );
  }
}
