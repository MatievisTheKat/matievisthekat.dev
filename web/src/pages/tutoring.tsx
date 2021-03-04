import React from "react";

import Layout from "../components/layout/Layout";
import SEO from "../components/layout/SEO";
import Box from "../components/Box";

interface State {}
interface Props {}

export default class Services extends React.Component<Props, State> {
  public render() {
    return (
      <Layout>
        <SEO title="Tutoring" description="Freelance tutoring services" />
        <Box>
          <h1 className="font-nunito font-bold">Tutoring</h1>
          <br />
          <span>
            I offer personal tutoring for aspiring coders. <br />
            <br />I can teach you to code in JavaScript and use it to build websites, mobile/desktop apps, bots, and more! <br />
            <br />
            If you have any enquiries please{" "}
            <a className="link" rel="noreferrer" target="_blank" href="mailto:matthew@matievisthekat.dev">
              email me
            </a>{" "}
            at matthew@matievisthekat.dev
          </span>
        </Box>
      </Layout>
    );
  }
}
