import { StaticQuery, graphql, Link } from "gatsby";
import React from "react";

interface State {}
interface Props {}
interface UserLink {
  url: string;
  name: string;
}

const UserLinksQuery = graphql`
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
`;

export default class LoggedInLinks extends React.Component<Props, State> {
  public render() {
    return (
      <StaticQuery
        query={UserLinksQuery}
        render={({ site }) => {
          const links: UserLink[] = site.siteMetadata.userMenuLinks;
          if (!links.find((l) => l.name.toLowerCase() === "sign out"))
            links.push({ name: "Sign Out", url: `/signout/?continueTo=${window.location.pathname}` });

          return links.map((l, i) => (
            <Link
              to={l.url}
              className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out"
              role="menuitem"
              key={i}
            >
              {l.name}
            </Link>
          ));
        }}
      />
    );
  }
}
