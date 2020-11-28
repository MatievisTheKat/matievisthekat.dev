import Axios from "axios";
import React, { ChangeEvent, FormEvent } from "react";

import Link from "../Link";
import PasswordInput from "./PasswordInput";
import SubmitButton from "./SubmitButton";
import UsernameInput from "./UsernameInput";

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

export default class Form extends React.Component<Props, State> {
  private onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (this.props.usernameErr || this.props.passwordErr || !this.props.username || !this.props.password) return;

    Axios.post(`${process.env.API}/users/login`, {
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
        <div className="mb-8">
          <UsernameInput username={this.props.username} error={this.props.usernameErr} onChange={this.props.onUsernameChange} />
        </div>
        <div className="mb-8">
          <PasswordInput password={this.props.password} error={this.props.passwordErr} onChange={this.props.onPasswordChange} />
        </div>

        {this.props.loginErr && <p className="text-red-500 text-xs italic mb-4">{this.props.loginErr}</p>}

        <div className="flex items-center justify-between">
          <SubmitButton
            loading={this.props.loading}
            passwordErr={this.props.passwordErr || !this.props.password ? true : false}
            usernameErr={this.props.usernameErr || !this.props.username ? true : false}
          />
          <label className="md:w-2/3 block font-bold">
            <input className="mr-2 leading-tight" type="checkbox" onChange={this.props.onRememberChange} />
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
