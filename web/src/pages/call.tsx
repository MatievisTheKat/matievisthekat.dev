import React from "react";
import Peer from "peerjs";
import qs from "querystring";
import hark from "hark";

import Layout from "../components/layout/Layout";
import SEO from "../components/layout/SEO";
import Box from "../components/Box";
import Button from "../components/Button";

import { getCurrentUser } from "../../util";
import { User } from "../../types";

interface State {
  localStream?: any;
  localSpeaking: boolean;
  remoteStream?: any;
  remoteSpeaking: boolean;
  peer?: Peer;
  call?: Peer.MediaConnection;
  calling: boolean;
}
interface Props {}

export default class Call extends React.Component<Props, State> {
  private user = getCurrentUser(true) as User;

  constructor(props: Props | Readonly<Props>) {
    super(props);

    this.state = {
      remoteSpeaking: false,
      localSpeaking: false,
      calling: false,
    };
  }

  private endCall() {
    const { call } = this.state;
    if (call) call.close();
  }

  private call(id: string) {
    const { localStream, peer } = this.state;

    if (localStream && peer) {
      const call = peer.call(id, localStream);
      this.setState({ calling: true, call });

      call.on("stream", (stream) => {
        const video = document.querySelector("video#remote") as HTMLVideoElement | null;
        if (video) video.srcObject = stream;
      });

      call.on("close", () => {
        this.setState({ calling: false });
        peer.destroy();
      });
    }
  }

  public componentWillUnmount() {
    const { peer } = this.state;
    if (peer) peer.destroy();
  }

  public componentDidMount() {
    const peer = new Peer(this.user.username, {
      host: process.env.PEER_HOST,
      port: process.env.PEER_PORT ? parseInt(process.env.PEER_PORT) : undefined,
      path: process.env.PEER_PATH,
    });

    this.setState({ peer });

    peer.on("call", (call) => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        const video = document.querySelector(`video#remote`) as HTMLVideoElement | null;

        call.answer(stream);
        call.on("stream", (remoteStream) => {
          if (video) {
            video.srcObject = remoteStream;
          } else console.warn("Local video element not found");

          const remoteSpeechEvents = hark(stream);
          remoteSpeechEvents.on("speaking", () => this.setState({ remoteSpeaking: true }));
          remoteSpeechEvents.on("stopped_speaking", () => this.setState({ remoteSpeaking: false }));
        });
      });
    });

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      this.setState({ localStream: stream });

      const video = document.querySelector(`video#local`) as HTMLVideoElement | null;
      const localSpeechEvents = hark(stream);

      localSpeechEvents.on("speaking", () => this.setState({ localSpeaking: true }));
      localSpeechEvents.on("stopped_speaking", () => this.setState({ localSpeaking: false }));

      if (video) video.srcObject = stream;
    });
  }

  public render() {
    if (typeof window === "undefined") return null;
    const { id } = qs.parse(window.location.href, "?") as Record<string, string>;

    return (
      <Layout>
        <SEO title="Video Call" />
        <Box className="max-w-full">
          <Button disabled={this.state.calling} onClick={() => this.call(id)}>
            Call
          </Button>
          <Button disabled={!this.state.calling} colour="red" onClick={() => this.endCall()}>
            End Call
          </Button>
          <div className="flex flex-row mt-3">
            <video
              muted={true}
              title={this.user.username}
              id="local"
              autoPlay={true}
              className={`${this.state.localSpeaking ? "border-yellow-400 border-4" : ""} w-1/2`}
            />
            <video title={id} id="remote" autoPlay={true} className={`${this.state.remoteSpeaking ? "border-yellow-400 border-4" : ""} w-1/2`} />
          </div>
        </Box>
      </Layout>
    );
  }
}
