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
        <SEO title="Home" />
        <div className="text-center">
          <h1>Home</h1>
        </div>
      </Layout>
    );
  }
}
