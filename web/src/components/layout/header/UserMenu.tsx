import { Link, StaticQuery, graphql } from "gatsby";
import React from "react";
import Cookies from "universal-cookie";

import { User } from "../../../../types";

const cookies = new Cookies();

interface State {}
interface Props {
  user?: User;
  open: boolean;
  setOpen(open?: boolean): void;
}
interface UserLink {
  url: string;
  name: string;
}

export default class UserMenu extends React.Component<Props, State> {
  public render() {
    const user: User = cookies.get("user");
    const pathname = window.location.pathname;

    return (
      <div className="ml-3 relative">
        <div>
          <button
            className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-white transition duration-150 ease-in-out"
            id="user-menu-button"
            aria-label="User menu"
            aria-haspopup="true"
            onClick={() => this.props.setOpen()}
          >
            <img
              className="h-8 w-8 rounded-full"
              id="user-menu-img"
              src={user ? `http://localhost:3000${user.avatarUrl}` : "http://localhost:3000/avatars/default"}
              alt={`${user ? "User" : "Default"} avatar`}
            />
          </button>
        </div>
        <div className={this.props.open ? "origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg" : "hidden"}>
          <div
            className="py-1 rounded-md bg-white shadow-xs"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="user-menu"
            aria-expanded={this.props.open}
          >
            {user ? (
              <StaticQuery
                query={graphql`
                  query UserLinksQuery {
                    site {
                      siteMetadata {
                        userMenuLinks {
                          url
                          name
                        }
                      }
                    }
                  }
                `}
                render={({ site }) => {
                  const links: UserLink[] = site.siteMetadata.userMenuLinks;
                  if (!links.find((l) => l.name.toLowerCase() === "sign out"))
                    links.push({ name: "Sign Out", url: `/signout?continueTo=${pathname.startsWith("/me") ? "/" : pathname}` });

                  return links.map((l) => (
                    <Link
                      to={l.url}
                      className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out"
                      role="menuitem"
                    >
                      {l.name}
                    </Link>
                  ));
                }}
              />
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
          </div>
        </div>
      </div>
    );
  }
}
