import React, { ChangeEvent, Suspense } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Axios from "axios";
import qs from "querystring";

import Layout from "../components/layout/Layout";
import SEO from "../components/layout/SEO";
import Box from "../components/Box";
import Error from "../components/Error";
import Button from "../components/Button";
import BarLoader from "../components/loaders/Bar";
import CDNFile from "../components/cdn/CdnRedirect";

const FileList = React.lazy(() => import("../components/cdn/FileList"));

import { getCurrentJwt, getCurrentUser } from "../../util";
import { ApiResponse, FileResponse } from "../../types";

interface State {
  files?: File[];
  loading: boolean;
  error?: string;
  uploaded?: FileResponse[];
  viewFiles?: string[];
}
interface Props {}

export default class ContentDeliveryNetwork extends React.Component<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);

    this.state = {
      files: undefined,
      loading: false,
      error: undefined,
      uploaded: undefined,
      viewFiles: undefined,
    };
  }

  set loading(loading: boolean) {
    this.setState({ loading });
  }

  private removeFile(i: number, stateProp: "uploaded" | "files" | "viewFiles" = "files") {
    this.loading = true;
    const state = this.state[stateProp];

    if (state) {
      state.splice(i, 1);
      //@ts-ignore
      this.setState({ [stateProp]: state });
    }

    this.loading = false;
  }

  private viewFiles() {
    this.loading = true;

    Axios.get<ApiResponse>(`${process.env.API}/cdn/list`, {
      headers: {
        Authorization: `Bearer ${getCurrentJwt()}`,
      },
    })
      .then((res) => this.setState({ viewFiles: res.data.data, uploaded: undefined, files: undefined }))
      .catch(this.handleErr.bind(this))
      .finally(() => (this.loading = false));
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
        .then((res) => this.setState({ files: undefined, viewFiles: undefined, uploaded: res.data.data as FileResponse[] }))
        .catch(this.handleErr.bind(this))
        .finally(() => (this.loading = false));
    }
  }

  private handleErr(err: any) {
    this.setState({ error: err.response.data.error });
  }

  private onInputChange(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();

    this.loading = true;

    const files = e.target.files;
    if (files) this.setState({ files: [...files] });

    this.loading = false;
  }

  public render() {
    if (typeof window === "undefined") return null;

    const { f } = qs.parse(window.location.href, "?") as Record<string, string>;
    if (f) return <CDNFile file={f} />;

    const user = getCurrentUser(true);
    if (!user) return null;

    return (
      <Layout>
        <SEO title="Content Delviery Network" description="Admin-Only content delivery network for matievisthekat.dev" />
        {!user.admin ? (
          <Error code={401}>You are not authorized to view this page</Error>
        ) : (
          <Box>
            <h1>Content Delviery Network</h1>
            {this.state.loading && <BarLoader />}

            <p className="text-sm mt-4">
              <label className="hover:pointer mt-3 mx-1 bg-blue-500 text-white font-bold shadow appearance-none rounded w-full max-w-xs py-2 px-3 leading-tight hover:bg-blue-700">
                {this.state.files && this.state.files.length > 0 ? `${this.state.files.length} files selected` : "Select file(s)"}
                <input type="file" multiple={true} className="hidden" onChange={this.onInputChange.bind(this)} />
              </label>
              <Button padding="py-2 px-3" className="mt-3 mx-1 shadow appearance-none rounded leading-tight" onClick={this.viewFiles.bind(this)}>
                File List
              </Button>
            </p>

            <ul className="mt-3 content-center">
              {this.state.files &&
                this.state.files.map((f, i) => (
                  <li key={i}>
                    {f.name}
                    <span className="ml-2">
                      <FontAwesomeIcon className="text-red-500 hover:pointer" icon={faTimes} onClick={() => this.removeFile(i)} />
                    </span>
                  </li>
                ))}
            </ul>

            {this.state.files && this.state.files.length > 0 && (
              <Button className="mt-3 text-sm" padding="md" colour="green" onClick={this.onUpload.bind(this)}>
                Upload
              </Button>
            )}

            {this.state.uploaded && !this.state.files && (
              <Suspense fallback={true}>
                <FileList
                  files={this.state.uploaded}
                  onError={this.handleErr.bind(this)}
                  onFileRemove={(name) => {
                    const { uploaded } = this.state;
                    if (uploaded) this.removeFile(uploaded.indexOf(uploaded.find((f) => f.filename === name) as FileResponse), "uploaded");
                  }}
                />
              </Suspense>
            )}

            {this.state.viewFiles && !this.state.files && !this.state.uploaded && (
              <Suspense fallback={true}>
                <FileList
                  files={this.state.viewFiles}
                  onError={this.handleErr.bind(this)}
                  onFileRemove={(name) => {
                    const { viewFiles } = this.state;
                    if (viewFiles) this.removeFile(viewFiles.indexOf(name), "viewFiles");
                  }}
                />
              </Suspense>
            )}

            {this.state.error && <p className="mt-3 text-red-500">{this.state.error}</p>}
          </Box>
        )}
      </Layout>
    );
  }
}
