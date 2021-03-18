import React, { Suspense } from "react";

const Age = React.lazy(() => import("./Age"));

export default function Intro() {
  const props = {
    rel: "noreferrer",
    target: "_blank",
    className: "link",
  };

  return (
    <>
      <span className="animate__animated animate__fadeIn font-nunito font-semibold" style={{ animationDelay: "0.7s" }}>
        Freelance developing and tutoring services
      </span>
      <div className="mb-8" />
      <span className="font-nunito">
        My name is Matthew Stead, I am{" "}
        <span style={{ fontFamily: "monospace" }}>
          <Suspense fallback={0}>
            <Age />
          </Suspense>
        </span>{" "}
        years old and I have been programming for 5 years.
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
    </>
  );
}
