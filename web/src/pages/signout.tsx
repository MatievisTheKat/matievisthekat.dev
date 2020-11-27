import React from "react";
import Cookies from "universal-cookie";
import qs from "querystring";

import Layout from "../components/layout/Layout";
import SEO from "../components/layout/SEO";

const cookies = new Cookies();

interface State {}
interface Props {}

export default class SignOut extends React.Component<Props, State> {
  public componentDidMount() {
    cookies.remove("user");
  }

  public render() {
    if (typeof window === "undefined") return null;
    const { continueTo } = qs.parse(window.location.href, "?") as Record<string, string>;
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
