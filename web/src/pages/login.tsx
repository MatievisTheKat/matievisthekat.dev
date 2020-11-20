import Axios from "axios";
import { Link } from "gatsby";
import ms from "ms";
import React, { ChangeEvent, FormEvent } from "react";
import Cookies from "universal-cookie";
import qs from "querystring";

import Box from "../components/Box";
import Layout from "../components/layout/Layout";
import SEO from "../components/layout/SEO";

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
}
interface Props {}

export default class Login extends React.Component<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);

    this.state = {
      passwordErr: "",
      password: "",

      usernameErr: "",
      username: "",
    };
  }

  private handlePwdChange(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();

    const password = e.target.value;
    let passwordErr = undefined;

    if (!password) passwordErr = "Please provide a password.";
    else if (password.length < 6) passwordErr = "Password must be more than 6 characters.";

    this.setState({
      password,
      passwordErr,
      passwordValid: passwordErr ? false : true,
    });
  }

  private handleUsernameChange(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();

    const username = e.target.value;
    let usernameErr = undefined;

    if (!username) usernameErr = "Please provide a username.";
    else if (username.length < 4) usernameErr = "Username must be more than 4 characters.";
    else if (username.length > 18) usernameErr = "Username must be less than 16 characters.";
    else if (!/^[A-Za-z0-9_-]*$/.test(username)) usernameErr = "Username may only contain letters, numbers, underscores and dashes.";

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

        Axios.get("http://localhost:3000/users/me", {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        })
          .then((res) => {
            cookies.set("user", res.data.data);

            const { continueTo } = qs.parse(window.location.href, "?") as Record<string, string>;

            window.location.href = continueTo || "/me";
          })
          .catch((err) => {
            this.setState({
              loginErr: err.response.data.error,
            });
          });
      })
      .catch((err) => {
        this.setState({
          loginErr: err.response.data.error,
        });
      });
  }

  private handleRememberChange(e: ChangeEvent<HTMLInputElement>) {
    this.setState({
      rememberMe: e.target.checked,
    });
  }

  public componentDidMount() {
    const jwt = cookies.get("jwt");
    if (jwt) {
      Axios.get("http://localhost:3000/users/me", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
        .then((res) => {
          cookies.set("user", res.data);

          window.location.href = "/me";
        })
        .catch(() => {});
    }
  }

  public render() {
    return (
      <Layout>
        <SEO title="Login" />
        <Box>
          <form className="text-center" onSubmit={this.handleSubmit.bind(this)}>
            <div className="mb-8">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
              <input
                className="shadow appearance-none border rounded w-full max-w-xs py-2 px-3 text-gray-700 mb-2 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                name="username"
                placeholder="Username"
                value={this.state.username}
                onChange={this.handleUsernameChange.bind(this)}
              />
              {this.state.usernameValid === false ? <p className="text-red-500 text-xs italic">{this.state.usernameErr}</p> : null}
            </div>
            <div className="mb-8">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full max-w-xs py-2 px-3 text-gray-700 mb-2 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                name="password"
                placeholder="************"
                value={this.state.password}
                onChange={this.handlePwdChange.bind(this)}
              />
              {this.state.passwordValid === false ? <p className="text-red-500 text-xs italic">{this.state.passwordErr}</p> : null}
            </div>

            {this.state.loginErr ? <p className="text-red-500 text-xs italic mb-4">{this.state.loginErr}</p> : null}

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

              <label className="md:w-2/3 block text-gray-700 font-bold">
                <input className="mr-2 leading-tight" type="checkbox" onChange={this.handleRememberChange.bind(this)} />
                <span className="text-sm">Remember me</span>
              </label>

              <Link className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" to="#">
                Forgot Password?
              </Link>
            </div>
          </form>
        </Box>
      </Layout>
    );
  }
}
