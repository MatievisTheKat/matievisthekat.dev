import React from "react";
import Axios from "axios";

import Layout from "../../components/layout/Layout";
import SEO from "../../components/layout/SEO";
import Box from "../../components/Box";
import UserAvatar from "../../components/UserAvatar";
import AvatarSelection from "../../components/AvatarSelection";

import { getCurrentUser, getCurrentJwt, refreshUser, getCookie } from "../../../util";
import { ApiResponse } from "../../../types";

interface State {
  avatars?: string[];
}
interface Props {}

export default class Settings extends React.Component<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);

    this.state = {
      avatars: undefined,
    };
  }

  private updateAvatar(av: string) {
    const jwt = getCurrentJwt();

    Axios.put<ApiResponse>(
      `${process.env.API}/users/update`,
      { avatarUrl: av },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    )
      .then(() => {
        refreshUser(getCookie("remember") === "true").then(() => {
          this.forceUpdate();
        });
      })
      .catch(console.error);
  }

  public componentDidMount() {
    Axios.get<ApiResponse>(`${process.env.API}/avatars`)
      .then((res) => {
        this.setState({
          avatars: res.data.data,
        });
      })
      .catch(console.error);
  }

  public render() {
    if (typeof window === "undefined") return null;
    const user = getCurrentUser(true);
    if (!user) return null;

    return (
      <Layout>
        <SEO title="User Settings" description="Customize your experience on matievisthekat.dev" />
        <Box>
          <UserAvatar src={user.avatar_url} className="mx-auto mb-3" />
          <p>Select an avatar:</p>
          {this.state.avatars && (
            <AvatarSelection
              exclude={`${user.avatar_url}${user.avatar_url.endsWith(".webp") || user.avatar_url.endsWith(".png") ? "" : ".webp"}`}
              avatars={this.state.avatars}
              onClick={this.updateAvatar.bind(this)}
            />
          )}
        </Box>
      </Layout>
    );
  }
}
