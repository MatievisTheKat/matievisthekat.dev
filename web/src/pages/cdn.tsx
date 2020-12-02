import React, { ChangeEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import Axios from "axios";

import Layout from "../components/layout/Layout";
import SEO from "../components/layout/SEO";
import Box from "../components/Box";
import Error from "../components/Error";
import Button from "../components/Button";
import BarLoader from "../components/loaders/Bar";
import Link from "../components/Link";

import { getCurrentJwt, getCurrentUser } from "../../util";
import { ApiResponse } from "../../types";

interface State {
  files?: File[];
  loading: boolean;
  error?: string;
  uploaded?: ResponseFile[];
}
interface Props {}
interface ResponseFile {
  destination: string;
  encoding: string;
  fieldname: string;
  filename: string;
  mimetype: string;
  originalname: string;
  path: string;
  size: number;
}

export default class ContentDeliveryNetwork extends React.Component<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);

    this.state = {
      files: undefined,
      loading: false,
      error: undefined,
      uploaded: undefined,
    };
  }

  set loading(loading: boolean) {
    this.setState({ loading });
  }

  private onInputChange(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();

    this.loading = true;

    const files = e.target.files;
    if (files) this.setState({ files: [...files] });

    this.loading = false;
  }

  private removeFile(i: number) {
    this.loading = true;

    if (this.state.files) {
      this.state.files.splice(i, 1);
      this.setState({ files: this.state.files });

      this.loading = false;
    }
  }

  private onUpload(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();

    if (this.state.files && this.state.files.length > 0) {
      this.loading = true;

      const form = new FormData();

      for (const file of this.state.files) form.append("file", file, file.name);

      Axios.post<ApiResponse>(`${process.env.API}/cdn/upload`, form, {
        headers: {
          Authorization: `Bearer ${getCurrentJwt()}`,
        },
      })
        .then((res) => this.setState({ files: undefined, uploaded: res.data.data as ResponseFile[] }))
        .catch((err) => this.setState({ error: err.response.data.error }))
        .finally(() => (this.loading = false));
    }
  }

  public render() {
    const user = getCurrentUser(true);
    if (!user) return null;

    return (
      <Layout>
        <SEO title="Content Delviery Network" />
        {!user.admin ? (
          <Error code={401}>You are not authorized to view this page</Error>
        ) : (
          <Box>
            <h1>Content Delviery Network</h1>
            {this.state.loading && <BarLoader width={NaN} />}
            <p className="text-sm mt-4">
              <label className="hover-mouse-pointer mt-3 bg-blue-500 text-white font-bold shadow appearance-none rounded w-full max-w-xs py-2 px-3 leading-tight hover:bg-blue-700">
                {this.state.files && this.state.files.length > 0 ? `${this.state.files.length} files selected` : "Select file(s)"}
                <input type="file" multiple={true} className="hidden" onChange={this.onInputChange.bind(this)} />
              </label>
            </p>
            <ul className="mt-3 content-center">
              {this.state.files &&
                this.state.files.map((f, i) => (
                  <li key={i}>
                    {f.name}
                    <span className="ml-2">
                      <FontAwesomeIcon className="text-red-500 hover-mouse-pointer" icon={faTimes} onClick={(e) => this.removeFile(i)} />
                    </span>
                  </li>
                ))}
            </ul>
            {this.state.files && this.state.files.length > 0 && (
              <Button className="mt-3 text-sm" padding="md" colour="green" onClick={this.onUpload.bind(this)}>
                Upload
              </Button>
            )}
            {this.state.error && <p className="mt-3 text-red-500">{this.state.error}</p>}
            {this.state.uploaded && (
              <ul className="mt-3 content-center text-blue-400">
                {this.state.uploaded.map((file, i) => (
                  <li key={i}>
                    <Link to={`/cdn/${file.filename}`}>{file.filename}</Link>
                    <span className="ml-2">
                      <FontAwesomeIcon icon={faCopy} />
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Box>
        )}
      </Layout>
    );
  }
}
