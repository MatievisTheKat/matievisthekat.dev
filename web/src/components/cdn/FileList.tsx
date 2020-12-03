import React from "react";

import FileListItem from "./FileListItem";

import { FileResponse } from "../../../types";

interface State {}
interface Props {
  files: FileResponse[] | string[];
  onError(err: any): void;
  onFileRemove(name: string): void;
}

export default class FileList extends React.Component<Props, State> {
  public render() {
    return (
      <ul className="mt-3 content-center text-blue-400">
        {(this.props.files as any[]).map((file: FileResponse | string, i) => (
          <FileListItem file={file} key={i} onRemove={(_, name) => this.props.onFileRemove(name)} onError={this.props.onError} />
        ))}
      </ul>
    );
  }
}
