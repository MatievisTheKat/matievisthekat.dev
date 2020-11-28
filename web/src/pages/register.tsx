import React, { FormEvent } from "react";
import Axios from "axios";
import qs from "querystring";

import Layout from "../components/layout/Layout";
import SEO from "../components/layout/SEO";
import Box from "../components/Box";
import UsernameInput from "../components/forms/UsernameInput";
import PasswordInput from "../components/forms/PasswordInput";
import EmailInput from "../components/forms/EmailInput";
import SubmitButton from "../components/forms/SubmitButton";
import Link from "../components/Link";

import { getCurrentUser, onInputChange, saveUser, validateEmail, validatePassword, validateUsername } from "../../util";
import { ApiResponse, User } from "../../types";

interface State {
  username: string;
  usernameErr?: string;
  password: string;
  passwordErr?: string;
  confirmPass: string;
  confirmPassErr?: string;
  email: string;
  emailErr?: string;
  rememberMe: boolean;

  error?: string;
  loading: boolean;
}
interface Props {}

export default class Register extends React.Component<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);

    this.state = {
      username: "",
      password: "",
      confirmPass: "",
      email: "",
      rememberMe: false,
      loading: false,
    };
  }

  private set loading(loading: boolean) {
    this.setState({ loading });
  }

  private onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (
      this.state.usernameErr ||
      this.state.passwordErr ||
      this.state.emailErr ||
      this.state.confirmPassErr ||
      !this.state.username ||
      !this.state.password ||
      !this.state.email ||
      !this.state.confirmPass
    )
      return;

    this.loading = true;

    Axios.post<ApiResponse>(`${process.env.API}/users/register`, {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPass,
    })
      .then((res) => {
        const data = res.data.data;
        console.log(data);
        saveUser(data.user as User, data.jwt.token, this.state.rememberMe, data.jwt.expires);
        this.redirect();
      })
      .catch((err) => {
        this.handleError(err);
        this.loading = false;
      });
  }

  private handleError(err: any) {
    console.log(err);
    this.setState({
      error: err.response.data.error,
    });
  }

  private getRedirectUrl(toLogin?: boolean) {
    const { continueTo } = qs.parse(window.location.href, "?") as Record<string, string>;
    return `${toLogin ? "/login?continueTo=" : ""}${continueTo || "/me"}`;
  }

  private redirect(toLogin?: boolean) {
    window.location.href = this.getRedirectUrl(toLogin);
  }

  public render() {
    if (typeof window === "undefined") return null;
    const user = getCurrentUser();
    if (user) this.redirect();

    return (
      <Layout>
        <SEO title="Register" />
        <Box>
          <form className="text-center" onSubmit={this.onSubmit.bind(this)}>
            <UsernameInput
              value={this.state.username}
              error={this.state.usernameErr}
              onChange={onInputChange("username", "usernameErr", validateUsername).bind(this)}
              className="mb-5"
            />
            <EmailInput
              value={this.state.email}
              error={this.state.emailErr}
              onChange={onInputChange("email", "emailErr", validateEmail).bind(this)}
              className="mb-5"
            />

            <PasswordInput
              value={this.state.password}
              error={this.state.passwordErr}
              onChange={onInputChange("password", "passwordErr", validatePassword).bind(this)}
              className="mb-5"
            />
            <PasswordInput
              label="Confirm Password"
              value={this.state.confirmPass}
              error={this.state.confirmPassErr}
              onChange={onInputChange("confirmPass", "confirmPassErr", validatePassword).bind(this)}
              className="mb-5"
            />

            {this.state.error && <p className="text-red-500 text-xs italic mb-4">{this.state.error}</p>}

            <SubmitButton
              className="mb-2"
              label="Register"
              loading={this.state.loading}
              error={
                !!this.state.passwordErr ||
                !this.state.password ||
                !!this.state.usernameErr ||
                !this.state.username ||
                !!this.state.confirmPassErr ||
                !this.state.confirmPass
              }
            />
            <br />
            <Link className="text-blue-500 hover:text-blue-800 font-bold text-sm" to={this.getRedirectUrl(true)}>
              Already have an account? Login instead
            </Link>
          </form>
        </Box>
      </Layout>
    );
  }
}
