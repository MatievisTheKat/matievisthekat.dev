import React from "react";
import qs from "querystring";

import { httpDefinitions, HTTPStatusCode } from "../../types";

import Layout from "../components/layout/Layout";
import SEO from "../components/layout/SEO";
import Error from "../components/Error";
import Back from "../components/Back";

interface State {}
interface Props {}

export default class ErrorDefinition extends React.Component<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);
  }

  public render() {
    const parsed = qs.parse(window.location.toString(), "?") as Record<string, string>;

    return (
      <Layout>
        <SEO
          title="Error Definition"
          description="View the description of any HTTP errors you may encounter on this site"
        />
        {!parsed?.code ? (
          <Error code={404}>
            <p>
              No error code was provided.
              <br />
              <Back>Back?</Back>
            </p>
          </Error>
        ) : (
          <div className="text-center">
            <h1 className="mb-3">{httpDefinitions[(parsed.code as unknown) as HTTPStatusCode]}</h1>
            <Back>Back</Back>
          </div>
        )}
      </Layout>
    );
  }
}
