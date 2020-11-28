import React from "react";

import Layout from "../components/layout/Layout";
import SEO from "../components/layout/SEO";
import Box from "../components/Box";
import { getCurrentUser } from "../../util";
import Error from "../components/Error";

interface State {}
interface Props {}

export default class ContentDeliveryNetwork extends React.Component<Props, State> {
  public render() {
    const user = getCurrentUser(true);
    if (!user) return null;

    return (
      <Layout>
        <SEO title="Content Delviery Network" />
        {!user.admin ? (
          <Error code={401}>You are not authorized to view this page</Error>
        ) : (
          <Box>
            <h1>Content Delviery Network</h1>
          </Box>
        )}
      </Layout>
    );
  }
}
