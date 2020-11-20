import Axios from "axios";
import ms from "ms";
import React, { ChangeEvent, FormEvent } from "react";
import { getUser, validatePassword, validateUsername } from "../../util";
import Cookies from "universal-cookie";

import Link from "./Link";
import TextInput from "./forms/Input";

const cookies = new Cookies();

interface State {
  passwordValid?: boolean;
  passwordErr?: string;
  password: string;

  usernameValid?: boolean;
  usernameErr?: string;
  username: string;

  loginErr?: string;

  rememberMe?: boolean;
  loading?: boolean;
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
    };
  }

  private handlePwdChange(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();

    const password = e.target.value;
    const passwordErr = validatePassword(password);

    this.setState({
      password,
      passwordErr,
      passwordValid: passwordErr ? false : true,
    });
  }

  private handleUsernameChange(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();

    const username = e.target.value;
    const usernameErr = validateUsername(username);

    this.setState({
      username,
      usernameErr,
      usernameValid: usernameErr ? false : true,
    });
  }

  private handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!this.state.usernameValid || !this.state.passwordValid) return;

    Axios.post("http://localhost:3000/users/login", {
      username: this.state.username,
      password: this.state.password,
    })
      .then((res) => {
        const data = res.data.data;

        if (this.state.rememberMe) {
          cookies.set("jwt", data.token, {
            maxAge: ms(data.expires as string) / 1000,
          });
        }

        this.saveLogin(data.token);
      })
      .catch(this.handleError.bind(this));
  }

  private handleError(err: any) {
    this.setState({
      loginErr: err.response.data.error,
    });
  }

  private handleRememberChange(e: ChangeEvent<HTMLInputElement>) {
    this.setState({
      rememberMe: e.target.checked,
    });
  }

  private saveLogin(jwt: string) {
    this.setState({
      loading: true,
    });
    getUser(jwt)
      .then((user) => {
        if (user) {
          cookies.set("user", user);
          this.props.onLogin();
        } else {
          this.setState({
            loading: false,
          });
        }
      })
      .catch((err) => {
        this.handleError(err);
        this.setState({
          loading: false,
        });
      });
  }

  public componentDidMount() {
    const jwt = cookies.get("jwt");
    if (jwt) this.saveLogin(jwt);
  }

  public render() {
    return (
      <form className="text-center" onSubmit={this.handleSubmit.bind(this)}>
        <div className="mb-8">
          <label className="block text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <TextInput
            className="mb-3"
            id="username"
            type="text"
            name="username"
            placeholder="Username"
            value={this.state.username}
            onChange={this.handleUsernameChange.bind(this)}
          />
          {!this.state.usernameValid && <p className="text-red-500 text-xs italic">{this.state.usernameErr}</p>}
        </div>
        <div className="mb-8">
          <label className="block text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <TextInput
            className="mb-3"
            id="password"
            type="password"
            name="password"
            placeholder="************"
            value={this.state.password}
            onChange={this.handlePwdChange.bind(this)}
          />
          {!this.state.passwordValid && <p className="text-red-500 text-xs italic">{this.state.passwordErr}</p>}
        </div>

        {this.state.loginErr && <p className="text-red-500 text-xs italic mb-4">{this.state.loginErr}</p>}

        <div className="flex items-center justify-between">
          <button
            className={`bg-blue-500 text-white font-bold py-2 px-4 rounded ${
              this.state.passwordValid && this.state.usernameValid
                ? "focus:outline-none focus:shadow-outline hover:bg-blue-700"
                : "opacity-50 cursor-not-allowed"
            }`}
            type="submit"
          >
            Login
          </button>

          <label className="md:w-2/3 block font-bold">
            <input className="mr-2 leading-tight" type="checkbox" onChange={this.handleRememberChange.bind(this)} />
            <span className="text-sm">Remember me</span>
          </label>

          <Link className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" to="#">
            Forgot Password?
          </Link>
        </div>
      </form>
    );
  }
}
