import React, { Suspense } from "react";
import { Helmet } from "react-helmet";
import { css } from "@emotion/css";

import Layout from "../components/layout/Layout";
import SEO from "../components/layout/SEO";

const Intro = React.lazy(() => import("../components/Intro"));

interface State {}
interface Props {}

export default class Home extends React.Component<Props, State> {
  public render() {
    const name = "MatievisTheKat";
    const letters = name.split("");
    const animations = [
      "animate__bounceInUp",
      "animate__lightSpeedInRight",
      "animate__lightSpeedInLeft",
      "animate__backInLeft",
      "animate__backInRight",
      "animate__rollIn",
      "animate__jackInTheBox",
    ];

    return (
      <>
        <Helmet>
          <style>
            {`
            body {
              overflow: hidden;
            }
            `}
          </style>
        </Helmet>
        <Layout>
          <SEO title="Home" />
          {letters.map((l, i) => (
            <div
              key={i}
              className={`animate__animated ${animations[Math.floor(Math.random() * animations.length)]} inline-block font-bold`}
              style={{ animationDelay: `${(i - 0) / 60}s` }}
            >
              <span
                className={css`
                  font-size: 50px;
                `}
              >
                {l}
              </span>
            </div>
          ))}
          <br />
          <Suspense fallback={true}>
            <Intro />
          </Suspense>
        </Layout>
      </>
    );
  }
}
