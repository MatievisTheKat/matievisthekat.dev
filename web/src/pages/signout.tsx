import React from "react";
import qs from "querystring";

import Layout from "../components/layout/Layout";
import SEO from "../components/layout/SEO";

import { removeCookie } from "../../util";

interface State {}
interface Props {}

export default class SignOut extends React.Component<Props, State> {
  public componentDidMount() {
    removeCookie("user");
  }

  public render() {
    if (typeof window === "undefined") return null;
    const continueTo = (qs.parse(window.location.href, "?") as Record<string, string>).continueTo || "/";
    window.location.href = continueTo.startsWith("/me") ? "/" : continueTo;

    return (
      <Layout>
        <SEO title="Sign Out" />
        <div className="text-center">
          <h1>Please wait...</h1>
        </div>
      </Layout>
    );
  }
}
