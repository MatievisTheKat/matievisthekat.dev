import Axios from "axios";
import React, { ChangeEvent, FormEvent } from "react";

import Link from "../Link";
import PasswordInput from "../forms/PasswordInput";
import SubmitButton from "../forms/SubmitButton";
import UsernameInput from "../forms/UsernameInput";
import { ApiResponse } from "../../../types";

interface State {}
interface Props {
  username: string;
  password: string;
  usernameErr?: string;
  passwordErr?: string;
  loginErr?: string;
  loading: boolean;

  saveLogin(jwt: string, expires?: string, overrideRemember?: boolean): void;
  handleError(err: any): void;
  onRememberChange(e: ChangeEvent<HTMLInputElement>): void;
  onUsernameChange(e: ChangeEvent<HTMLInputElement>): void;
  onPasswordChange(e: ChangeEvent<HTMLInputElement>): void;
}

export default class LoginForm extends React.Component<Props, State> {
  private onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (this.props.usernameErr || this.props.passwordErr || !this.props.username || !this.props.password) return;

    Axios.post<ApiResponse>(`${process.env.API}/users/login`, {
      username: this.props.username,
      password: this.props.password,
    })
      .then((res) => {
        const data = res.data.data;
        this.props.saveLogin(data.token, data.expires);
      })
      .catch(this.props.handleError);
  }

  public render() {
    return (
      <form className="text-center" onSubmit={this.onSubmit.bind(this)}>
        <UsernameInput value={this.props.username} error={this.props.usernameErr} onChange={this.props.onUsernameChange} className="mb-5" />
        <PasswordInput value={this.props.password} error={this.props.passwordErr} onChange={this.props.onPasswordChange} className="mb-5" />

        {this.props.loginErr && <p className="text-red-500 text-xs italic mb-4">{this.props.loginErr}</p>}

        <div className="flex items-center justify-between">
          <SubmitButton
            label="Login"
            loading={this.props.loading}
            error={(this.props.passwordErr || !this.props.password ? true : false) || (this.props.usernameErr || !this.props.username ? true : false)}
          />
          <label className="md:w-2/3 block font-bold">
            <input className="mr-2 leading-tight" type="checkbox" onChange={this.props.onRememberChange} />
            <span className="text-sm">Remember me</span>
          </label>
          <Link className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" to="/register">
            Register instead?
          </Link>
        </div>
      </form>
    );
  }
}
