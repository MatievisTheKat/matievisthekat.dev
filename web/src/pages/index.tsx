import React from "react";
import { Link } from "gatsby";

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
          <h1>Hi people</h1>
          <p>Welcome to your new Gatsby site.</p>
          <p>Now go build something great.</p>
          <Link to="/page-2/">Go to page 2</Link> <br />
          <Link to="/using-typescript/">Go to "Using TypeScript"</Link>
        </div>
      </Layout>
    );
  }
}
