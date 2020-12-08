import React from "react";
import Peer from "peerjs";
import qs from "querystring";

import Layout from "../components/layout/Layout";
import SEO from "../components/layout/SEO";
import Box from "../components/Box";

import { getCurrentUser } from "../../util";
import Button from "../components/Button";

interface State {
  localStream?: any;
  remoteStream?: any;

  peer?: Peer;
}
interface Props {}

export default class Call extends React.Component<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);
  }

  private call(id: string) {
    const { localStream, peer } = this.state;

    if (localStream && peer) {
      const call = peer.call(id, localStream);
      console.log(`Calling ${id}`);

      call.on("stream", (stream) => {
        const video = document.querySelector("video#remote") as HTMLVideoElement | null;
        if (video) {
          video.srcObject = stream;
        } else console.warn("Remote video element not found");
      });
    }
  }

  public componentDidMount() {
    if (typeof window === "undefined") return null;

    const user = getCurrentUser(true);
    if (!user) return null;

    const peer = new Peer(user.id, {
      host: "/",
      port: 3001,
    });

    this.setState({ peer });

    peer.on("call", (call) => {
      console.log(`Call from ${call.peer}`);
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          const video = document.querySelector(`video#remote`) as HTMLVideoElement | null;
          call.answer(stream);
          call.on("stream", (remoteStream) => {
            if (video) {
              video.srcObject = remoteStream;
            } else console.warn("Local video element not found");
          });
        })
        .catch((err) => {
          console.error("Failed to get local stream", err);
        });
    });

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        this.setState({ localStream: stream });

        const video = document.querySelector(`video#local`) as HTMLVideoElement | null;
        if (video) {
          video.srcObject = stream;
          video.addEventListener("loadedmetadata", () => {
            video.play();
          });
        } else console.warn("No local video element");
      })
      .catch((err) => {
        console.error("Failed to get local stream", err);
      });
  }

  public render() {
    if (typeof window === "undefined") return null;

    const { id } = qs.parse(window.location.href, "?") as Record<string, string>;

    return (
      <Layout>
        <SEO title="Video Call" />
        <Box>
          <Button
            onClick={(e) => {
              e.preventDefault();

              this.call(id);
            }}
          >
            Call
          </Button>
          <p className="mx-auto">Local</p>
          <video id="local" autoPlay={true} className="mx-auto flex-row" />
          <br />
          <br />
          <br />
          <p className="mx-auto">Remote</p>
          <video id="remote" autoPlay={true} className="mx-auto flex-row" />
        </Box>
      </Layout>
    );
  }
}
