import React from "react";
import Cookies from "universal-cookie";
import qs from "querystring";

import Layout from "../components/layout/Layout";
import SEO from "../components/layout/SEO";

const cookies = new Cookies();

interface State {}
interface Props {}

export default class SignOut extends React.Component<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);
  }

  public render() {
    const { continueTo } = qs.parse(window.location.href, "?") as Record<string, string>;

    cookies.remove("user");

    window.location.href = continueTo || "/";
    
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
