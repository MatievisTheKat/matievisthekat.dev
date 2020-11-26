import React from "react";

import Layout from "../components/layout/Layout";
import SEO from "../components/layout/SEO";
import Error from "../components/Error";

import { getCurrentJwt, getCurrentUser } from "../../util";
import Box from "../components/Box";
import Axios from "axios";
import Button from "../components/Button";

interface State {
  jwt?: string;
  files: string[];
  file?: string;
  year?: string;
  month?: string;
  day?: string;
}
interface Props {}
interface DateObject {
  year?: string;
  month?: string;
  day?: string;
}

export default class Logs extends React.Component<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);

    this.state = {
      files: [],
    };
  }

  private getLog(name: string) {
    const { year, month, day } = this.getFileDate(name);

    this.setState({ year, month, day }, () => this.updateLogs());
  }

  private getFileDate(name: string): DateObject {
    const parts = name.split("-");

    const year = parts[0];
    const month = parts[1];
    const day = parts[2].split(".")[0];

    return { year, month, day };
  }

  private async updateLogs(jwt?: string) {
    const { year, month, day } = this.state;
    const date = `${year ? `${year}/${month ? `${month}/${day ?? ""}` : ""}` : ""}`;

    console.log(date);

    Axios.get(`http://localhost:3000/logs/${date}`, {
      headers: {
        Authorization: `Bearer ${jwt || this.state.jwt}`,
      },
    })
      .then((res) => {
        if (res.data.data) {
          this.setState({
            files: res.data.data,
          });
        } else {
          this.setState({ file: res.data });
        }
      })
      .catch(console.error);
  }

  public componentDidMount() {
    const user = getCurrentUser();

    if (user && user.admin) {
      const jwt = getCurrentJwt();
      this.setState({ jwt });

      this.updateLogs(jwt);
    }
  }

  public render() {
    return (
      <Layout>
        <SEO title="Logs" />
        {!this.state.jwt ? (
          <Error code={401}>
            <p>You are not authorized to view this page</p>
          </Error>
        ) : (
          <Box className={`w-full max-w-full mb-10 ${this.state.file ? "text-left" : "text-center"}`}>
            {this.state.file ? (
              <span className="whitespace-pre-wrap">{this.state.file.replace(/\\n/gi, "<br />")}</span>
            ) : (
              this.state.files.map((f, i) => (
                <Button
                  key={i}
                  className="mx-1"
                  colour="blue"
                  onClick={(e) => {
                    e.preventDefault();
                    this.getLog(f);
                  }}
                >
                  {f}
                </Button>
              ))
            )}
          </Box>
        )}
      </Layout>
    );
  }
}
