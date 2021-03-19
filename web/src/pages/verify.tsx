import React from "react";
import qs from "querystring";
import Axios from "axios";

import Layout from "../components/layout/Layout";
import SEO from "../components/layout/SEO";
import Box from "../components/Box";

import { getCurrentJwt, getCurrentUser } from "../../util";
import { ApiResponse } from "../../types";
import Button from "../components/Button";

interface State {
  error?: string;
  done: boolean;
}
interface Props {}

export default class Verify extends React.Component<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);

    this.state = {
      error: undefined,
      done: false,
    };
  }

  public componentDidMount() {
    const { code } = qs.parse(window.location.href, "?") as Record<string, string>;
    if (!code) {
      this.setState({ error: "No verification code recognized." });
    } else {
      Axios.put<ApiResponse>(
        `${process.env.API}/verify/${code}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getCurrentJwt()}`,
          },
        }
      )
        .then(() => this.setState({ done: true }))
        .catch((err) => this.setState({ error: err.response.data.error }));
    }
  }

  private resend() {
    Axios.post(
      `${process.env.API}/verify/create`,
      {
        override: true,
      },
      {
        headers: {
          Authorization: `Bearer ${getCurrentJwt()}`,
        },
      }
    )
      .then(() => this.setState({ error: "Resent verification code!" }))
      .catch((err) => this.setState({ error: err.response.data.error || err.message }));
  }

  public render() {
    if (typeof window === "undefined") return null;
    const user = getCurrentUser(true);
    if (!user) return null;

    return (
      <Layout>
        <SEO title="Verify" description="Verify your email address" />
        <Box>
          <h1>{this.state.error ? this.state.error : this.state.done ? "Verified! You can close this tab" : "Verifying... Please wait..."}</h1>
          <br />
          {this.state.error && <Button onClick={this.resend.bind(this)}>Resend code</Button>}
        </Box>
      </Layout>
    );
  }
}
