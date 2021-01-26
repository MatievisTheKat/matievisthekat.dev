import React from "react";
import { Helmet } from "react-helmet";
import { css } from "@emotion/css";

import Layout from "../components/layout/Layout";
import SEO from "../components/layout/SEO";
import Age from "../components/Age";

interface State {}
interface Props {}

export default class Home extends React.Component<Props, State> {
  public render() {
    const props = {
      rel: "noreferer",
      target: "_blank",
      className: "link",
    };
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
          <span className="animate__animated animate__fadeIn font-nunito font-semibold" style={{ animationDelay: "0.7s" }}>
            Freelance developing and tutoring services
          </span>
          <div className="mb-8" />
          <span className="font-nunito">
            My name is Matthew Stead, I am <Age /> years old and I have been programming for 5 years.
            <br />I am experienced in{" "}
            <a href="https://nodejs.org/en/" {...props}>
              NodeJS
            </a>
            ,{" "}
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTML" {...props}>
              HTML/CSS
            </a>
            ,{" "}
            <a href="https://www.python.org/" {...props}>
              Python
            </a>
            ,{" "}
            <a href="https://docs.microsoft.com/en-us/dotnet/csharp/" {...props}>
              C#
            </a>
            ,{" "}
            <a href="https://www.java.com/en/" {...props}>
              Java
            </a>
            ,{" "}
            <a href="https://www.php.net/" {...props}>
              PHP
            </a>
            ,{" "}
            <a href="https://en.wikipedia.org/wiki/C%2B%2B" {...props}>
              C++
            </a>
            <br />
            <br />
            You can view all my public projects on my{" "}
            <a href="https://github.com/MatievisTheKat" {...props}>
              GitHub profile
            </a>
          </span>
        </Layout>
      </>
    );
  }
}
