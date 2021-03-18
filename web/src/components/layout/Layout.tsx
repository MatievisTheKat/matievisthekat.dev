import React, { Suspense } from "react";
import { StaticQuery, graphql } from "gatsby";
import { ToastProvider } from "react-toast-notifications";

import Header from "./header/Header";
import Footer from "./footer/Footer";

const ConnectivityListener = React.lazy(() => import("./ConnectivityListener"));

import "../../assets/css/global.css";
import "../../assets/css/tailwind.css";
import "animate.css";

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

const Layout: React.FC<Props> = ({ tab, children }) => {
  if (typeof window === "undefined") return null;
  const toSlug = (str: string) => str.trim().replace(/\//gi, "-").toLowerCase();

  return (
    <StaticQuery
      query={SiteTitleQuery}
      render={({ site }) => {
        const currentTab = tab ? toSlug(tab) : toSlug(window.location.pathname.slice(1));
        return (
          <ToastProvider placement="top-right" autoDismiss={true}>
            <div className="flex flex-col h-screen justify-between">
              <Header title={site.siteMetadata?.title} tab={currentTab} />
              <main className="mb-auto lg:mx-48 mt-10 text-center text-gray-600 place-content-center">{children}</main>
              <Footer />
              <Suspense fallback={null}>
                <ConnectivityListener />
              </Suspense>
            </div>
          </ToastProvider>
        );
      }}
    />
  );
};

export default Layout;
