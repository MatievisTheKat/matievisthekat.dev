import React, { FormEvent } from "react";
import Axios from "axios";

import EmailInput from "./forms/EmailInput";
import PasswordInput from "./forms/PasswordInput";
import SubmitButton from "./forms/SubmitButton";
import UsernameInput from "./forms/UsernameInput";
import Link from "./Link";

import { saveUser, onInputChange, validateUsername, validateEmail, validatePassword } from "../../util";
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
interface Props {
  redirect(toLogin?: boolean): void;
  getRedirectUrl(toLogin?: boolean): string;
}

export default class RegisterForm extends React.Component<Props, State> {
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
        this.props.redirect();
      })
      .catch((err) => {
        this.handleError(err);
        this.loading = false;
      });
  }

  private handleError(err: any) {
    console.warn(err);
    this.setState({
      error: err.response.data.error,
    });
  }

  public render() {
    return (
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
        <Link className="text-blue-500 hover:text-blue-800 font-bold text-sm" to={this.props.getRedirectUrl(true)}>
          Already have an account? Login instead
        </Link>
      </form>
    );
  }
}
