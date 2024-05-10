import { useEffect, useRef, useState, MutableRefObject } from "react";
import { Body } from "matter-js";
import Peer from "simple-peer";
import { Socket } from "socket.io-client";
import { updateLsideSkeleton } from "../utils/updateLsideSkeleton";
import { updateRsideSkeleton } from "../utils/updateRsideSkeleton";

const pcConfig = {
  iceServers: [
    {
      urls: ["turn:43.203.29.69:3478?transport=tcp"],
      username: "team2",
      credential: "team2",
    },
  ],
};

interface PeerObject {
  peerID: string;
  peer: Peer.Instance;
}

interface WebRTCResult {
  userVideo: React.MutableRefObject<HTMLVideoElement | null>;
  peers: PeerObject[];
  indexRef: MutableRefObject<number>;
}

const useWebRTC = (
  nestjsSocketRef: MutableRefObject<Socket | null>,
  roomName: string,
  leftArmLeftRef: MutableRefObject<Body | null>,
  rightHand1RightRef: MutableRefObject<Body | null>,
  rightHand2RightRef: MutableRefObject<Body | null>,
  canvasSize: { x: number; y: number }
): WebRTCResult => {
  const userVideo = useRef<HTMLVideoElement | null>(null);
  const peersRef = useRef<PeerObject[]>([]);
  const [peers, setPeers] = useState<PeerObject[]>([]);
  const indexRef = useRef(0);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }

        if (nestjsSocketRef.current && nestjsSocketRef.current.id) {
          nestjsSocketRef.current.emit("join-room", roomName);

          nestjsSocketRef.current.on("room-full", () => {
            alert("Room is full!");
            window.location.href = "/";
          });

          nestjsSocketRef.current.on("all-users", (users: string[]) => {
            console.log("All users received: ", users); // 콘솔에 모든 사용자 출력
            const peers: PeerObject[] = [];
            users.forEach((userID) => {
              const peer = createPeer(userID, nestjsSocketRef.current!.id!, stream);
              const peerObj: PeerObject = { peerID: userID, peer };
              peersRef.current.push(peerObj);
              peers.push(peerObj);
            });
            setPeers(peers);
            indexRef.current = users.length;
            console.log("Peers updated: ", peers); // peers 업데이트된 내용 출력
          });

          nestjsSocketRef.current.on("user-joined", (payload: { signal: any; callerID: string }) => {
            const peer = addPeer(payload.signal, payload.callerID, stream);
            const peerObj: PeerObject = { peer, peerID: payload.callerID };
            peersRef.current.push(peerObj);
            setPeers((users) => [...users, peerObj]);
            console.log("User joined: ", payload.callerID); // 새 사용자 joined
          });

          nestjsSocketRef.current.on("receiving-returned-signal", (payload: { id: string; signal: any }) => {
            const item = peersRef.current.find((p) => p.peerID === payload.id);
            if (item) item.peer.signal(payload.signal);
          });

          nestjsSocketRef.current.on("user-left", (id: string) => {
            const peerObj = peersRef.current.find((p) => p.peerID === id);
            if (peerObj) peerObj.peer.destroy();
            const peers = peersRef.current.filter((p) => p.peerID !== id);
            peersRef.current = peers;
            setPeers(peers);
            console.log("User left: ", id); // 사용자 left
          });

          nestjsSocketRef.current.on("send-left-hand-joint", (data: any) => {
            if (indexRef.current === 1) {
              handleReceivedLeftHandJoint(data);
            }
          });

          nestjsSocketRef.current.on("send-right-hand-joint", (data: any) => {
            if (indexRef.current === 0) {
              handleReceivedRightHandJoint(data);
            }
          });
        }
      });
  }, [roomName]);

  const createPeer = (userToSignal: string, callerID: string, stream: MediaStream): Peer.Instance => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
      config: pcConfig,
    });

    peer.on("signal", (signal) => {
      nestjsSocketRef.current?.emit("sending-signal", {
        userToSignal,
        callerID,
        signal,
      });
    });

    return peer;
  };

  const addPeer = (incomingSignal: any, callerID: string, stream: MediaStream): Peer.Instance => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
      config: pcConfig,
    });

    peer.on("signal", (signal) => {
      nestjsSocketRef.current?.emit("returning-signal", { signal, callerID });
    });

    peer.signal(incomingSignal);
    return peer;
  };

  const handleReceivedLeftHandJoint = (data: any) => {
    const { joint1Start, joint1End } = data;
    updateLsideSkeleton(leftArmLeftRef, joint1Start, joint1End, canvasSize);
  };

  const handleReceivedRightHandJoint = (data: any) => {
    const { joint1, joint2, joint3 } = data;
    updateRsideSkeleton(rightHand1RightRef, joint1, joint2, canvasSize);
    updateRsideSkeleton(rightHand2RightRef, joint2, joint3, canvasSize);
  };

  return { userVideo, peers, indexRef };
};

export default useWebRTC;
