import React, { Suspense } from "react";

import Layout from "../components/layout/Layout";
import SEO from "../components/layout/SEO";

const DevIntro = React.lazy(() => import("../components/DevIntro"));

interface State {}
interface Props {}

export default class Products extends React.Component<Props, State> {
  public render() {
    return (
      <Layout>
        <SEO title="Development" description="Freelance development services" />
        <Suspense fallback={true}>
          <DevIntro />
        </Suspense>
      </Layout>
    );
  }
}
