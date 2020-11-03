import React from "react";

import Layout from "../components/layout/Layout";
import SEO from "../components/layout/SEO";

interface State {}
interface Props {}

export default class Index extends React.Component<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);
  }

  public render() {
    return (
      <Layout>
        <SEO title="Products" />
        <div className="text-center">
          <h1>Products</h1>
        </div>
      </Layout>
    );
  }
}
