import React from "react";

import Layout from "../components/layout/Layout";
import SEO from "../components/layout/SEO";

interface State {}
interface Props {}

export default class Index extends React.Component<Props, State> {
  public render() {
    return (
      <Layout>
        <SEO title="Services" />
        <div className="text-center">
          <h1>Services</h1>
        </div>
      </Layout>
    );
  }
}
