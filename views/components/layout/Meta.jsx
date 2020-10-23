import React from "react";

export default class Meta extends React.Component {
  render() {
    const desc =
      "I am a freelance developer with 4 years experience. I fluent in JavaScript within the Node environment as well as the browser. I have a solid understanding of HTML and CSS. I have a lot of experience with web and server-side apps";
    const title = "Matthew Stead | Freelance developer";
    const keywords = [
      "discord",
      "developer",
      "bort",
      "bot",
      "matievisthekat",
      "matievis",
      "node",
      "nodejs",
      "javascript",
      "stead",
      "matthew",
    ];

    return (
      <>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="description" content={desc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="msapplication-TileColor" content="#e722e7" />
        <meta name="keywords" content={keywords.join(", ")} />
        <meta property="og:type" content="profile" />
        <meta property="og:image" content="/assets/images/icon.png" />
        <meta property="og:title" content={title} />
        <meta property="og:url" content="https://matievisthekat.dev" />
        <meta property="og:description" content={desc} />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content={title} />
        <meta name="theme-color" content="#e722e7" />
      </>
    );
  }
}
