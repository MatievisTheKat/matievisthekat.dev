import React, { useEffect, useState } from "react";
import Peer, { MediaConnection } from "peerjs";
import { useToasts } from "react-toast-notifications";

import ClickableText from "../ClickableText";

interface Props {
  peer: Peer;
  acceptCall(call: MediaConnection): void;
}

const CallListener: React.FC<Props> = ({ peer, acceptCall }) => {
  const { addToast } = useToasts();
  const [receivingCall, setReceivingCall] = useState<MediaConnection>();

  peer.on("call", (call) => setReceivingCall(call));

  useEffect(() => {
    if (receivingCall)
      addToast(
        <div>
          <strong>{receivingCall.peer} is calling</strong>
          <div>
            <ClickableText onClick={() => acceptCall(receivingCall)}>Accept</ClickableText> the call or reject it by closing this notification
          </div>
        </div>,
        { appearance: "info" }
      );
  }, [receivingCall]);

  return null;
};

export default CallListener;
