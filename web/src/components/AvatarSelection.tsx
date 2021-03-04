import React from "react";

import UserAvatar from "./UserAvatar";

interface State {}
interface Props {
  avatars: string[];
  exclude?: string;
  onClick(a: string): void;
}

export default class AvatarSelection extends React.Component<Props, State> {
  public render() {
    return (
      <div className="flex-row flex overflow-x-auto rounded bg-gray-400 p-2 shadow-inner">
        {this.props.avatars.map((a, i) => {
          if (a !== this.props.exclude)
            return (
              <UserAvatar src={a} width="12" className="mx-1 hover:pointer hover:shadow-lg" key={i} onClick={(e) => this.props.onClick(a)} />
            );
        })}
      </div>
    );
  }
}
