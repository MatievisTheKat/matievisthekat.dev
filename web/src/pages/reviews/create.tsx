import React from "react";

import Layout from "../../components/layout/Layout";
import SEO from "../../components/layout/SEO";
import Box from "../../components/Box";

interface State {}
interface Props {}

export default class Reviews extends React.Component<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);

    this.state = {};
  }

  public render() {
    return (
      <Layout>
        <SEO title="Create a review" description="Leave a review for matievisthekat.dev" />
        <Box></Box>
      </Layout>
    );
  }
}
