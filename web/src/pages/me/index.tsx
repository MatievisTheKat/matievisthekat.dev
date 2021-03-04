import React from "react";

import Box from "../../components/Box";
import Layout from "../../components/layout/Layout";
import SEO from "../../components/layout/SEO";
import UserAvatar from "../../components/UserAvatar";

import { getCurrentUser } from "../../../util";

interface State {}
interface Props {}

export default class Me extends React.Component<Props, State> {
  public render() {
    if (typeof window === "undefined") return null;
    const user = getCurrentUser(true);
    if (!user) return null;

    return (
      <Layout>
        <SEO title="Profile" description="View your profile on matievisthekat.dev" />
        <Box>
          <UserAvatar src={user.avatar_url} className="mx-auto mb-3" />
          <h1 className="font-bold">{user.username}</h1>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </Box>
      </Layout>
    );
  }
}
