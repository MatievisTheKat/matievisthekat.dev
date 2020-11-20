import React from "react";
import qs from "querystring";

import Box from "../components/Box";
import Layout from "../components/layout/Layout";
import SEO from "../components/layout/SEO";
import LoginForm from "../components/LoginForm";

interface State {}
interface Props {}

export default class Login extends React.Component<Props, State> {
  private redirect() {
    const { continueTo } = qs.parse(window.location.href, "?") as Record<string, string>;
    window.location.href = continueTo || "/me";
  }

  public render() {
    return (
      <Layout>
        <SEO title="Login" />
        <Box>
          <LoginForm onLogin={this.redirect} />
        </Box>
      </Layout>
    );
  }
}
