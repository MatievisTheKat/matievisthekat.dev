import React from "react";

import Layout from "../components/layout/Layout";
import SEO from "../components/layout/SEO";
import Box from "../components/Box";

interface State {}
interface Props {}

export default class Reviews extends React.Component<Props, State> {
  public render() {
    return (
      <Layout>
        <SEO title="" />
        <Box>
          <h1 className="font-nunito font-bold">Reviews</h1>
          <br />
        </Box>
      </Layout>
    );
  }
}
