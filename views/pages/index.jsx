import React from "react";
import Layout from "../components/Layout";

export default class Index extends React.Component {
  render() {
    return (
      <Layout>
        <h1>{this.props.title}</h1>
      </Layout>
    );
  }
}
