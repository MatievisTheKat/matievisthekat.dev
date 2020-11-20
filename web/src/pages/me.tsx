import React from "react";
import Cookies from "universal-cookie";

import Box from "../components/Box";
import Layout from "../components/layout/Layout";
import SEO from "../components/layout/SEO";

const cookies = new Cookies();

interface State {}
interface Props {}

export default class Me extends React.Component<Props, State> {
  public render() {
    const user = cookies.get("user");

    if (!user) {
      window.location.href = "/login?continueTo=/me";
    }

    return (
      <Layout>
        <SEO title="Profile" />
        <Box>
          <h1 className="font-bold text-gray-500">{user.username}</h1>
        </Box>
      </Layout>
    );
  }
}
