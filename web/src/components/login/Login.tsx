import React, { ChangeEvent } from "react";

import RememberedLogin from "./RemeberedLogin";
import Form from "./Form";

import { getCurrentJwt, getCurrentUser, getUser, saveUser, validatePassword, validateUsername } from "../../../util";
import { User } from "../../../types";

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
interface Props {
  onLogin(): void;
}

export default class LoginForm extends React.Component<Props, State> {
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

  private onUsernameChange(e: ChangeEvent<HTMLInputElement>) {
    const username = e.target.value;
    const usernameErr = validateUsername(username);

    this.setState({
      username,
      usernameErr,
    });
  }

  private onPasswordChange(e: ChangeEvent<HTMLInputElement>) {
    const password = e.target.value;
    const passwordErr = validatePassword(password);

    this.setState({
      password,
      passwordErr,
    });
  }

  private handleError(err: any) {
    this.setState({
      loginErr: err.response.data.error,
    });
  }

  private saveLogin(jwt: string, expires?: string, overrideRemember?: boolean) {
    this.loading = true;

    getUser(jwt)
      .then((user) => {
        if (user) {
          saveUser(user, jwt, overrideRemember || this.state.rememberMe, expires);
          this.props.onLogin();
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

  public componentDidMount() {
    const user = getCurrentUser();
    if (user) {
      this.props.onLogin();
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
      <>
        {this.state.rememberedLogin ? (
          <RememberedLogin
            username={this.state.rememberedLogin.username}
            login={this.loginRemembered.bind(this)}
            setRemembered={this.setRemembered.bind(this)}
          />
        ) : (
          <Form
            onPasswordChange={this.onPasswordChange.bind(this)}
            onUsernameChange={this.onUsernameChange.bind(this)}
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
        )}
      </>
    );
  }
}
