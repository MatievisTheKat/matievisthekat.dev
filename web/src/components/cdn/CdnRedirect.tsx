import React from "react";
import { navigate } from "gatsby";

import Layout from "../layout/Layout";
import SEO from "../layout/SEO";
import Box from "../Box";

interface State {}
interface Props {
  file: string;
}

export default class CDNFile extends React.Component<Props, State> {
  public render() {
    if (typeof window === "undefined") return null;
    const file = this.props.file;
    navigate(`${process.env.API}/cdn/${file}`);

    return (
      <Layout>
        <SEO title="Content Delivery Network" />
        <Box>
          <h1>Redirecting. Please wait...</h1>
        </Box>
      </Layout>
    );
  }
}
