import { Link } from "gatsby";
import React from "react";

import LoggedInLinks from "./LoggedInLinks";

interface State {}
interface Props {
  loggedIn?: boolean;
}

export default class UserLinks extends React.Component<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);
  }

  public render() {
    const pathname = window.location.pathname;

    return (
      <>
        {this.props.loggedIn ? (
          <LoggedInLinks />
        ) : (
          <>
            <Link
              to={`/register?continueTo=${pathname}`}
              className="block px-4 py-2 text-sm leading-5 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out"
              role="menuitem"
            >
              Register
            </Link>
            <Link
              to={`/login?continueTo=${pathname}`}
              className="block px-4 py-2 text-sm leading-5 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out"
              role="menuitem"
            >
              Login
            </Link>
          </>
        )}
      </>
    );
  }
}
