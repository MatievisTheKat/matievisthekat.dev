import React from "react";
import { StaticQuery, graphql } from "gatsby";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faFacebook, faDiscord, faInstagram, faYoutube, faLinkedin, faTwitter, faReddit } from "@fortawesome/free-brands-svg-icons";
import Link from "../Link";

interface State {}
interface Props {}
interface SocialLink {
  name: string;
  slug: string;
  url: string;
}

const icons: Record<string, any> = {
  github: faGithub,
  discord: faDiscord,
  linkedin: faLinkedin,
  facebook: faFacebook,
  instagram: faInstagram,
  youtube: faYoutube,
  twitter: faTwitter,
  reddit: faReddit,
};

export default class Footer extends React.Component<Props, State> {
  public render() {
    return (
      <StaticQuery
        query={graphql`
          query MyQuery {
            site {
              siteMetadata {
                socialLinks {
                  url
                  name
                  slug
                }
              }
            }
          }
        `}
        render={({ site }) => {
          const links: SocialLink[] = site.siteMetadata.socialLinks;

          return (
            <footer className="max-w-screen bg-gray-500 px-10 pt-8 pb-6 text-center text-gray-700 border-t-2 border-gray-600">
              <div className="row mx-auto">
                {links.map((l: SocialLink, i) => {
                  if (icons[l.slug]) {
                    return (
                      <Link external={true} to={l.url} title={l.name} className="mx-3 text-lg" key={i}>
                        <FontAwesomeIcon icon={icons[l.slug]} />
                      </Link>
                    );
                  } else return null;
                })}
              </div>

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
            </footer>
          );
        }}
      />
    );
  }
}
