import React, { useEffect, useRef } from "react";
import Peer from "simple-peer";

interface VideoProps {
  peer: Peer.Instance;
  myIndexRef: number;
}

const Video: React.FC<VideoProps> = ({ peer, myIndexRef }) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    peer.on("stream", (stream: MediaStream) => {
      if (ref.current) {
        ref.current.srcObject = stream;
      }
    });

    return () => {
      peer.removeAllListeners("stream");
    };
  }, [peer]);

  return (
    <video
      id={myIndexRef === 0 ? "video-container-2" : "video-container-1"}
      autoPlay
      playsInline
      ref={ref}
    />
  );
};

export default Video;