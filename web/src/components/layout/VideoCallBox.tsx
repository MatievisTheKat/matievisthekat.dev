import hark from "hark";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompress } from "@fortawesome/free-solid-svg-icons";

interface State {
  speaking: boolean;
  remoteSpeaking: boolean;
  fullScreen: boolean;
}
interface Props {}

export default class VideoCallBox extends React.Component<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);

    this.state = {
      speaking: false,
      fullScreen: false,
      remoteSpeaking: false,
    };
  }

  private set fullScreen(fullScreen: boolean) {
    this.setState({ fullScreen }, () => this.updateStreams());
  }

  private updateStreams() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      const video = document.querySelector("video#local") as HTMLVideoElement | null;
      const remoteVideo = document.querySelector("video#remote") as HTMLVideoElement | null;
      const speech = hark(stream);

      speech.on("speaking", () => this.setState({ speaking: true }));
      speech.on("stopped_speaking", () => this.setState({ speaking: false }));

      if (video) video.srcObject = stream;
      if (remoteVideo) remoteVideo.srcObject = stream;
    });
  }

  public componentDidMount() {
    this.updateStreams();
  }

  public render() {
    const localVideo = (
      <video
        id="local"
        autoPlay={true}
        muted={true}
        title="You"
        className={
          this.state.fullScreen
            ? `md:w-1/2 md:max-w-screen md:align-middle ${this.state.speaking ? "border-yellow-400 border-4" : undefined}`
            : "hidden"
        }
      />
    );

    const remoteVideo = (
      <video
        id="remote"
        autoPlay={true}
        muted={false}
        title="Them"
        className={
          (this.state.fullScreen
            ? "md:w-1/2 md:max-w-screen md:align-middle"
            : "absolute rounded shadow float-right bottom-4 left-4 max-w-sm hover:shadow-xl hover-mouse-pointer") +
          (this.state.remoteSpeaking ? "border-yellow-400 border-4" : "")
        }
        onClick={(_) => {
          if (!this.state.fullScreen) this.fullScreen = true;
        }}
      />
    );

    return this.state.fullScreen ? (
      <div className="bg-black absolute w-screen h-screen overflow-y-auto">
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
    );
  }
}
