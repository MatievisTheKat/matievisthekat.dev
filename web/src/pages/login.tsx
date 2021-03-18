import React, { ChangeEvent, Suspense } from "react";
import qs from "querystring";
import { navigate } from "gatsby";

import Box from "../components/Box";
import Layout from "../components/layout/Layout";
import SEO from "../components/layout/SEO";
import RememberedLogin from "../components/login/RemeberedLogin";

const LoginForm = React.lazy(() => import("../components/login/Form"));

import { getUser, getCurrentUser, getCurrentJwt, onInputChange, validatePassword, validateUsername, saveLogin } from "../../util";
import { User } from "../../types";

interface State {
  passwordErr?: string;
  password: string;
  usernameErr?: string;
  username: string;
  loginErr?: string;
  rememberMe: boolean;
  rememberedLogin?: User;
  rememberedJwt?: string;
  loading: boolean;
}
interface Props {}

export default class Login extends React.Component<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);

    this.state = {
      username: "",
      password: "",
      rememberMe: false,
      loading: false,
    };
  }

  set loading(loading: boolean) {
    this.setState({ loading });
  }

  private onRememberChange(e: ChangeEvent<HTMLInputElement>) {
    this.setState({
      rememberMe: e.target.checked,
    });
  }

  private handleError(err: any) {
    this.setState({
      loginErr: err.response.data.error,
    });
  }

  private saveLogin(jwt: string, expires?: string, overrideRemember?: boolean) {
    this.loading = true;
    saveLogin
      .bind(this)(jwt, expires, overrideRemember || this.state.rememberMe)
      .then((user) => {
        if (user) {
          this.redirect();
        } else {
          this.loading = false;

          if (this.state.rememberedLogin) {
            this.setState({
              rememberedLogin: undefined,
              rememberedJwt: undefined,
            });
          }
        }
      })
      .catch((err) => {
        this.handleError(err);
        this.loading = false;
      });
  }

  private loginRemembered() {
    if (!this.state.rememberedJwt || !this.state.rememberedLogin) return;
    this.saveLogin(this.state.rememberedJwt, undefined, true);
  }

  private setRemembered(user?: User, jwt?: string) {
    this.setState({
      rememberedLogin: user,
      rememberedJwt: jwt,
    });
  }

  private redirect() {
    const { continueTo } = qs.parse(window.location.href, "?") as Record<string, string>;
    navigate(continueTo || "/me");
  }

  public componentDidMount() {
    const user = getCurrentUser();
    if (user) {
      this.redirect();
    } else {
      const jwt = getCurrentJwt();
      if (jwt) {
        getUser(jwt)
          .then((user) => {
            this.setRemembered(user, jwt);
          })
          .catch(() => {});
      }
    }
  }

  public render() {
    return (
      <Layout>
        <SEO title="Login" description="Login to your account on matievisthekat.dev" />
        <Box>
          {this.state.rememberedLogin ? (
            <RememberedLogin
              username={this.state.rememberedLogin.username}
              login={this.loginRemembered.bind(this)}
              resetRemembered={this.setRemembered.bind(this)}
            />
          ) : (
            <Suspense fallback={true}>
              <LoginForm
                onPasswordChange={onInputChange("password", "passwordErr", validatePassword).bind(this)}
                onUsernameChange={onInputChange("username", "usernameErr", validateUsername).bind(this)}
                onRememberChange={this.onRememberChange.bind(this)}
                saveLogin={this.saveLogin.bind(this)}
                handleError={this.handleError.bind(this)}
                username={this.state.username}
                usernameErr={this.state.usernameErr}
                password={this.state.password}
                passwordErr={this.state.passwordErr}
                loading={this.state.loading}
                loginErr={this.state.loginErr}
              />
            </Suspense>
          )}
        </Box>
      </Layout>
    );
  }
}
