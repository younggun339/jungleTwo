import React, { useEffect, useRef } from "react";
import Peer from "simple-peer";
import { PeerObject } from '../hooks/useWebRTC';

interface VideoProps {
  peer: Peer.Instance;
  peers: PeerObject[];
  myIndexRef: number;
  onLoaded?: () => void;
}

const Video: React.FC<VideoProps> = ({ peer, peers, myIndexRef }) => {
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
  }, [peer, peers]);

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