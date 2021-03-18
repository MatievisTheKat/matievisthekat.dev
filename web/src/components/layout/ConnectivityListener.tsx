import React, { useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";

const ConnectivityListener: React.FC = () => {
  const { addToast } = useToasts();
  const [online, setOnline] = useState(window.navigator.onLine);
  const [hasGoneOffline, setHasGoneOffline] = useState(false);

  const onlineHandler = () => setOnline(true);
  const offlineHandler = () => {
    if (!hasGoneOffline) setHasGoneOffline(true);
    setOnline(false);
  };

  useEffect(() => {
    window.addEventListener("online", onlineHandler);
    window.addEventListener("offline", offlineHandler);

    return () => {
      window.removeEventListener("online", onlineHandler);
      window.removeEventListener("offline", offlineHandler);
    };
  }, []);

  useEffect(() => {
    if (hasGoneOffline)
      addToast(
        <div>
          <strong>{online ? "Online" : "Offline"}</strong>
          <div>{online ? "Internet connection is back!" : "Internet connection has been lost!"}</div>
        </div>,
        {
          appearance: "info",
        }
      );
  }, [online]);

  return null;
};

export default ConnectivityListener;
