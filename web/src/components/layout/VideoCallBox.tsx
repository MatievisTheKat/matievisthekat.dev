import React from "react";
import hark from "hark";
import Popup from "reactjs-popup";
import Peer, { MediaConnection } from "peerjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompress, faPhoneAlt } from "@fortawesome/free-solid-svg-icons";

import CallListener from "./CallListener";

import { User } from "../../../types";
import { onInputChange, setSessionItem, validateUsername } from "../../../util";
import UsernameInput from "../forms/UsernameInput";
import Button from "../Button";

interface State {
  speaking: boolean;
  streamStatus: StreamStatus;
  remoteSpeaking: boolean;
  fullScreen: boolean;
  onCall: boolean;
  error?: string;
  callUsername: string;
  callUsernameError?: string;
}
interface Props {
  user?: User | void;
}
type StreamStatus = "not_found" | "looking" | "found";

export default class VideoCallBox extends React.Component<Props, State> {
  private user = this.props.user;
  private peer = this.user
    ? new Peer(this.user.username, {
        host: process.env.PEER_HOST,
        port: process.env.PEER_PORT ? parseInt(process.env.PEER_PORT) : undefined,
        path: process.env.PEER_PATH,
      })
    : undefined;

  private streams: {
    local?: MediaStream;
    remote?: MediaStream;
  } = {};

  constructor(props: Props | Readonly<Props>) {
    super(props);

    this.state = {
      speaking: false,
      fullScreen: false,
      remoteSpeaking: false,
      streamStatus: "looking",
      onCall: false,
      callUsername: "",
    };
  }

  private set localStream(stream: MediaStream) {
    this.streams.local = stream;
    this.updateVideo("local", stream);
  }

  private set remoteStream(stream: MediaStream) {
    this.streams.remote = stream;
    this.onCall = true;
    this.updateVideo("remote", stream);
  }

  private set fullScreen(fullScreen: boolean) {
    this.setState({ fullScreen }, () => this.updateAllVideos());
  }

  private set onCall(onCall: boolean) {
    this.setState({ onCall });
  }

  private handleErr(err: Error) {
    this.setState({ error: err.message });
  }

  private onCallStream(stream: MediaStream) {
    this.remoteStream = stream;
  }

  private acceptCall(call: MediaConnection) {
    if (!this.streams.local) {
      this.initLocalStream().then((stream) => call.answer(stream));
    } else call.answer(this.streams.local);

    call.on("stream", this.onCallStream.bind(this));
  }

  private async call(id: string) {
    const peer = this.peer;
    if (!peer || !this.user) return false;
    if (peer && peer.disconnected) peer.connect(this.user.username);

    const stream = this.streams.local || (await this.initLocalStream());
    const call = peer.call(id, stream, { metadata: this.user });

    if (call) {
      // TODO: A way to storage call in session to reload doesn't close the call
      // setSessionItem("vc-remote-id", id);

      call.on("close", () => (this.onCall = false));
      call.on("stream", this.onCallStream.bind(this));

      window.addEventListener("close", () => call.close());
    } else console.warn("Call failed");
  }

  private updateVideo(id: string, stream: MediaStream, cb?: () => void) {
    const el = document.querySelector<HTMLVideoElement>(`video#${id}`);
    if (el) {
      el.srcObject = stream;
      if (cb) cb();
    }
  }

  private initLocalStream() {
    return new Promise<MediaStream>((res, rej) => {
      if (this.streams.local) console.warn("initLocalStream called while streams.local had a value");

      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          this.localStream = stream;
          const speech = hark(stream);

          speech.on("speaking", () => this.setState({ speaking: true }));
          speech.on("stopped_speaking", () => this.setState({ speaking: false }));

          this.updateVideo("local", stream, () => this.setState({ streamStatus: "found" }));

          res(stream);
        })
        .catch((err) => {
          this.handleErr(err);
          this.setState({ streamStatus: "not_found" });

          rej(err);
        });
    });
  }

  private updateAllVideos() {
    if (this.streams.local) this.updateVideo("local", this.streams.local);
    if (this.streams.remote) this.updateVideo("remote", this.streams.remote);
  }

  public async componentDidMount() {
    if (this.user && this.peer && this.streams.remote) {
      this.initLocalStream();
      this.updateAllVideos();
    }
  }

  public render() {
    if (!this.user) return null;

    const localVideo = (
      <div className={this.state.fullScreen ? `mx-auto my-auto rounded ${this.state.speaking ? "border-yellow-400 border-4" : undefined}` : "hidden"}>
        <video id="local" autoPlay={true} muted={true} title={`${this.user.username} (You)`} />
      </div>
    );

    const remoteVideo = (
      <div
        className={
          (this.state.fullScreen
            ? "mx-auto my-auto rounded"
            : "fixed rounded shadow bottom-4 left-4 max-w-sm w-full max-h-sm hover:shadow-xl hover-mouse-pointer") +
          (this.state.remoteSpeaking ? "border-yellow-400 border-4" : "")
        }
      >
        <video
          id="remote"
          autoPlay={true}
          muted={false}
          title={this.state.callUsername}
          className={!this.state.fullScreen ? "rounded" : undefined}
          onClick={(_) => {
            if (!this.state.fullScreen) this.fullScreen = true;
          }}
        />
      </div>
    );

    return (
      <>
        {this.peer && <CallListener peer={this.peer} acceptCall={this.acceptCall.bind(this)} />}

        {!this.state.onCall && (
          <Popup
            trigger={
              <div className="fixed left-8 bottom-8 rounded-full shadow bg-gray-600 w-16 h-16 text-center hover-mouse-pointer hover:shadow-2xl">
                <FontAwesomeIcon icon={faPhoneAlt} className="text-gray-300 w-full h-full font-bold" size="lg" />
              </div>
            }
            position="right center"
          >
            <div className="inline-block relative">
              <UsernameInput
                className="mr-0"
                onChange={onInputChange("callUsername", "callUsernameError", validateUsername).bind(this)}
                value={this.state.callUsername}
                showLabel={false}
              />
              <Button
                padding="px-3 py-2"
                disabled={!!this.state.callUsernameError || !!!this.state.callUsername}
                onClick={async (_) => await this.call(this.state.callUsername)}
                className="absolute inset-y-0 -right-12 mb-1 text-xs hover-mouse-pointer"
              >
                Call
              </Button>
            </div>
          </Popup>
        )}

        {this.state.onCall &&
          (this.state.fullScreen ? (
            <div className="bg-black fixed w-screen h-screen overflow-y-auto">
              <div className="text-center md:text-right md:mr-6 mt-3 p-5 text-white">
                <span className="hover-mouse-pointer p-2" onClick={(_) => (this.fullScreen = false)}>
                  <FontAwesomeIcon icon={faCompress} />
                </span>
              </div>
              <div className="flex flex-col md:flex-row">
                {localVideo}
                {remoteVideo}
              </div>
            </div>
          ) : (
            remoteVideo
          ))}
      </>
    );
  }
}
