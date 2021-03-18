import React from "react";
import qs from "querystring";
import { navigate } from "gatsby";

import Layout from "../components/layout/Layout";
import SEO from "../components/layout/SEO";

import { getCookie, removeCookie } from "../../util";

interface State {}
interface Props {}

export default class SignOut extends React.Component<Props, State> {
  public componentDidMount() {
    removeCookie("user");
    if (!getCookie("remember")) removeCookie("jwt");
  }

  public render() {
    if (typeof window === "undefined") return null;
    const continueTo = (qs.parse(window.location.href, "?") as Record<string, string>).continueTo || "/";
    navigate(continueTo.startsWith("/me") ? "/" : continueTo);

    return (
      <Layout>
        <SEO title="Sign Out" description="Sign out from your account on matievisthekat.dev" />
        <div className="text-center">
          <h1>Please wait...</h1>
        </div>
      </Layout>
    );
  }
}
