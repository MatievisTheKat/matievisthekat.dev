import React from "react";
import Axios from "axios";
import Cookies from "universal-cookie";

import { getCurrentUser, getCurrentJwt, refreshUser } from "../../../util";

import Layout from "../../components/layout/Layout";
import SEO from "../../components/layout/SEO";
import Box from "../../components/Box";
import UserAvatar from "../../components/UserAvatar";

const cookies = new Cookies();

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

    Axios.put(
      "http://localhost:3000/users/update",
      { avatarUrl: av },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    )
      .then(() => {
        refreshUser(cookies.get("remember") === "true").then(() => {
          this.forceUpdate();
        });
      })
      .catch(console.error);
  }

  public componentDidMount() {
    Axios.get("http://localhost:3000/avatars")
      .then((res) => {
        this.setState({
          avatars: res.data.data,
        });
      })
      .catch(console.error);
  }

  public render() {
    const user = getCurrentUser();
    if (!user) return;

    return (
      <Layout>
        <SEO title="User Settings" />
        <Box>
          <UserAvatar src={user.avatar_url} className="mx-auto mb-3" />
          <p>Select an avatar:</p>
          {this.state.avatars && (
            <div className="flex-row flex overflow-x-auto rounded bg-gray-400 p-2 shadow-inner">
              {this.state.avatars.map((a, i) => {
                if (a !== `${user.avatar_url}${user.avatar_url.endsWith(".png") ? "" : ".png"}`)
                  return (
                    <UserAvatar
                      src={a}
                      width="12"
                      className="mx-1 hover-mouse-pointer hover:shadow-lg"
                      key={i}
                      onClick={(e) => {
                        e.preventDefault();
                        this.updateAvatar(a);
                      }}
                    />
                  );
              })}
            </div>
          )}
        </Box>
      </Layout>
    );
  }
}
