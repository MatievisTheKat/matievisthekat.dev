import React from "react";
import { StaticQuery, graphql } from "gatsby";
import { ToastProvider } from "react-toast-notifications";

import Header from "./header/Header";
import Footer from "./footer/Footer";
import ConnectivityListener from "./ConnectivityListener";

import { getCurrentUser } from "../../../util";

import "../../assets/css/global.css";
import "../../assets/css/tailwind.css";

interface State {}
interface Props {
  tab?: string;
}

const SiteTitleQuery = graphql`
  query SiteTitleQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`;

export default class Layout extends React.Component<Props, State> {
  public render() {
    if (typeof window === "undefined") return null;
    const toSlug = (str: string) => str.trim().replace(/\//gi, "-").toLowerCase();

    return (
      <StaticQuery
        query={SiteTitleQuery}
        render={({ site }) => {
          const tab = this.props.tab ? toSlug(this.props.tab) : toSlug(window.location.pathname.slice(1));
          return (
            <ToastProvider placement="top-right" autoDismiss={true}>
              <div className="flex flex-col h-screen justify-between">
                <Header title={site.siteMetadata?.title} tab={tab} />
                <main className="mb-auto lg:mx-48 mt-10 text-center text-gray-600 place-content-center">{this.props.children}</main>
                <Footer />
                <ConnectivityListener />
              </div>
            </ToastProvider>
          );
        }}
      />
    );
  }
}
