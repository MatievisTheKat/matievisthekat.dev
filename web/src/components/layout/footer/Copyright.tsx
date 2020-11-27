import React from "react";

import Link from "../../Link";

interface State {}
interface Props {}

export default class Copyright extends React.Component<Props, State> {
  public render() {
    return (
      <span className="mt-auto text-xs">
        © Copyright MatievisTheKat 2020
        <br />
        Icons made by{" "}
        <Link className="text-gray-700" to="https://www.flaticon.com/authors/freepik" external={true} title="Freepik">
          Freepik
        </Link>{" "}
        from{" "}
        <Link to="https://www.flaticon.com/" external={true} title="Flaticon">
          www.flaticon.com
        </Link>
      </span>
    );
  }
}
