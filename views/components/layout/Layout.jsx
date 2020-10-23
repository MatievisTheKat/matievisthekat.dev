import React from "react";
import Head from "./Head";
import Header from "./Header";

export default class Layout extends React.Component {
  render() {
    return (
      <html lang="en">
        <Head title={this.props.title} />
        <body>
          <Header />
          <div className="bg-blue-600">{this.props.children}</div>
        </body>
      </html>
    );
  }
}
