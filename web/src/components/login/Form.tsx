import Axios from "axios";
import ms from "ms";
import React, { ChangeEvent, FormEvent } from "react";
import { getUser, saveUser, validatePassword, validateUsername } from "../../../util";
import Cookies from "universal-cookie";

import { User } from "../../../types";

import Link from "../Link";
import UsernameInput from "./UsernameInput";
import PasswordInput from "./PasswordInput";
import SubmitButton from "./SubmitButton";
import Button from "../Button";

const cookies = new Cookies();

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

  private onPasswordChange(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();

    const password = e.target.value;
    const passwordErr = validatePassword(password);

    this.setState({
      password,
      passwordErr,
    });
  }

  private onUsernameChange(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();

    const username = e.target.value;
    const usernameErr = validateUsername(username);

    this.setState({
      username,
      usernameErr,
    });
  }

  private onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (this.state.usernameErr || this.state.passwordErr || !this.state.username || !this.state.password) return;

    Axios.post("http://localhost:3000/users/login", {
      username: this.state.username,
      password: this.state.password,
    })
      .then((res) => {
        const data = res.data.data;
        this.saveLogin(data.token, data.expires);
      })
      .catch(this.handleError.bind(this));
  }

  private handleError(err: any) {
    this.setState({
      loginErr: err.response.data.error,
    });
  }

  private onRememberChange(e: ChangeEvent<HTMLInputElement>) {
    this.setState({
      rememberMe: e.target.checked,
    });
  }

  private saveLogin(jwt: string, expires?: string, overrideRemember?: boolean) {
    this.setState({
      loading: true,
    });

    getUser(jwt)
      .then((user) => {
        if (user) {
          saveUser(user, jwt, overrideRemember || this.state.rememberMe, expires);
          this.props.onLogin();
        } else {
          this.setState({
            loading: false,
          });

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
        this.setState({
          loading: false,
        });
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
    const user = cookies.get("user");
    if (user) {
      this.props.onLogin();
    } else {
      const jwt = cookies.get("jwt");
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
          <div className="text-center">
            <h1>We remember you! Would you like to continue as {this.state.rememberedLogin.username}?</h1>
            <div className="mt-3">
              <Button
                colour="blue"
                className="mx-1"
                onClick={(e) => {
                  e.preventDefault();
                  this.loginRemembered();
                }}
              >
                Yes
              </Button>
              <Button
                colour="red"
                className="mx-1"
                onClick={(e) => {
                  e.preventDefault();
                  this.setRemembered(undefined);
                }}
              >
                No
              </Button>
            </div>
          </div>
        ) : (
          <form className="text-center" onSubmit={this.onSubmit.bind(this)}>
            <div className="mb-8">
              <UsernameInput username={this.state.username} error={this.state.usernameErr} onChange={this.onUsernameChange.bind(this)} />
            </div>
            <div className="mb-8">
              <PasswordInput password={this.state.password} error={this.state.passwordErr} onChange={this.onPasswordChange.bind(this)} />
            </div>

            {this.state.loginErr && <p className="text-red-500 text-xs italic mb-4">{this.state.loginErr}</p>}

            <div className="flex items-center justify-between">
              <SubmitButton
                loading={this.state.loading}
                passwordErr={this.state.passwordErr || !this.state.password ? true : false}
                usernameErr={this.state.usernameErr || !this.state.username ? true : false}
              />

              <label className="md:w-2/3 block font-bold">
                <input className="mr-2 leading-tight" type="checkbox" onChange={this.onRememberChange.bind(this)} />
                <span className="text-sm">Remember me</span>
              </label>

              <Link className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" to="#">
                Forgot Password?
              </Link>
            </div>
          </form>
        )}
      </>
    );
  }
}
