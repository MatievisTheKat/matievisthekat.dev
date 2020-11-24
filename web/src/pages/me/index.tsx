import React from "react";
import Cookies from "universal-cookie";

import { getCurrentUser } from "../../../util";

import Box from "../../components/Box";
import Layout from "../../components/layout/Layout";
import SEO from "../../components/layout/SEO";
import UserAvatar from "../../components/UserAvatar";

const cookies = new Cookies();

interface State {}
interface Props {}

export default class Me extends React.Component<Props, State> {
  public render() {
    const user = getCurrentUser();
    if (!user) return;

    return (
      <Layout>
        <SEO title="Profile" />
        <Box>
          <UserAvatar src={user.avatarUrl} className="mx-auto mb-3" />
          <h1 className="font-bold">{user.username}</h1>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </Box>
      </Layout>
    );
  }
}
