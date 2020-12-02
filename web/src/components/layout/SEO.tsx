import React from "react";
import { Helmet } from "react-helmet";
import { graphql, StaticQuery } from "gatsby";

interface State {}
interface Props {
  description: string;
  lang: string;
  meta: any[];
  title: string;
}

const SeoQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        description
        author
      }
    }
  }
`;

export default class SEO extends React.Component<Props, State> {
  static defaultProps = {
    lang: "en",
    meta: [],
    description: "",
  };

  public render() {
    return (
      <StaticQuery
        query={SeoQuery}
        render={({ site }) => {
          const { lang, title, description, meta } = this.props;
          const metaDescription = description || site.siteMetadata.description;
          const defaultTitle = site.siteMetadata?.title;

          return (
            <Helmet
              htmlAttributes={{
                lang,
              }}
              title={title}
              titleTemplate={defaultTitle ? `%s | ${defaultTitle}` : undefined}
              meta={[
                {
                  name: "description",
                  content: metaDescription,
                },
                {
                  property: "og:title",
                  content: title,
                },
                {
                  property: "og:description",
                  content: metaDescription,
                },
                {
                  property: "og:type",
                  content: "website",
                },
                {
                  name: "twitter:card",
                  content: "summary",
                },
                {
                  name: "twitter:creator",
                  content: site.siteMetadata?.author || "",
                },
                {
                  name: "twitter:title",
                  content: title,
                },
                {
                  name: "twitter:description",
                  content: metaDescription,
                },
              ].concat(meta)}
            />
          );
        }}
      />
    );
  }
}
