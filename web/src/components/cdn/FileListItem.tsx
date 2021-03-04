import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import Axios, { AxiosResponse } from "axios";

import Link from "../Link";

import { ApiResponse, FileResponse } from "../../../types";
import { getCurrentJwt } from "../../../util";

interface State {
  deleting: boolean;
}
interface Props {
  key: number;
  file: FileResponse | string;
  onRemove(res: AxiosResponse<ApiResponse>, name: string): void;
  onError(err: any): void;
}

export default class FileListItem extends React.Component<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);

    this.state = {
      deleting: false,
    };
  }

  set deleting(deleting: boolean) {
    this.setState({ deleting });
  }

  private removeFile(name: string) {
    if (this.deleting) return;
    this.deleting = true;

    Axios.delete<ApiResponse>(`${process.env.API}/cdn/delete`, {
      headers: {
        Authorization: `Bearer ${getCurrentJwt()}`,
      },
      data: { name },
    })
      .then((res) => {
        this.deleting = false;
        this.props.onRemove(res, name);
      })
      .catch((err) => {
        this.deleting = false;
        this.props.onError(err);
      });
  }

  public render() {
    const file = this.props.file;
    const isString = typeof file === "string";
    const name = isString ? (file as string) : (file as FileResponse).filename;

    return (
      <li className="text-center">
        <Link to={`/cdn?f=${name}`} external={true}>
          {name}
        </Link>
        <span
          className="ml-2 hover:pointer hover:text-blue-700"
          onClick={() => navigator.clipboard.writeText(`${process.env.API}/cdn/${name}`)}
        >
          <FontAwesomeIcon icon={faCopy} />
        </span>
        <span className="ml-2 hover:pointer text-red-500 hover:text-red-700" onClick={() => this.removeFile(name)}>
          <FontAwesomeIcon icon={faTrashAlt} />
        </span>
      </li>
    );
  }
}
