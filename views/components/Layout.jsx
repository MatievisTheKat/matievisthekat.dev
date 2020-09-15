import React from "react";

export default class Layout extends React.Component {
  render() {
    return (
      <html lang="en">
        <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>{this.props.title}</title>

          <link rel="stylesheet" href="assets/css/global.css"/>
        </head>
        <body>
          <div className="bg-blue-600">{this.props.children}</div>
        </body>
      </html>
    );
  }
}
