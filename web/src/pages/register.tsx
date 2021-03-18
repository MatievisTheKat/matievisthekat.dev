import React, { Suspense } from "react";
import qs from "querystring";
import { navigate } from "gatsby";

import Layout from "../components/layout/Layout";
import SEO from "../components/layout/SEO";
import Box from "../components/Box";

const RegisterForm = React.lazy(() => import("../components/RegisterForm"));

import { getCurrentUser } from "../../util";

interface State {}
interface Props {}

export default class Register extends React.Component<Props, State> {
  private getRedirectUrl(toLogin?: boolean) {
    const { continueTo } = qs.parse(window.location.href, "?") as Record<string, string>;
    return `${toLogin ? "/login?continueTo=" : ""}${continueTo || "/me"}`;
  }

  private redirect(toLogin?: boolean) {
    navigate(this.getRedirectUrl(toLogin));
  }

  public render() {
    if (typeof window === "undefined") return null;
    const user = getCurrentUser();
    if (user) this.redirect();

    return (
      <Layout>
        <SEO title="Register" description="Register for a new account on matievisthekat.dev" />
        <Box>
          <Suspense fallback={true}>
            <RegisterForm redirect={this.redirect} getRedirectUrl={this.getRedirectUrl} />
          </Suspense>
        </Box>
      </Layout>
    );
  }
}
