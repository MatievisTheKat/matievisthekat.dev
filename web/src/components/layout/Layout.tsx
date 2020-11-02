import React from "react";
import { useStaticQuery, graphql } from "gatsby";

import Header from "./Header";

import "../../assets/css/tailwind.css";

export default function Layout({
  children,
  tab = window.location.pathname.slice(1).replace(/\//gi, "-").toLowerCase(),
}) {
  const { site } = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <>
      <Header title={site.siteMetadata?.title} tab={tab} />
      <main className="mx-20 my-10">{children}</main>
    </>
  );
}
