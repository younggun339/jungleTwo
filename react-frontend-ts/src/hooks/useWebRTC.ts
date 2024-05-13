import { useEffect, useRef, useState, MutableRefObject } from "react";
import { Body } from "matter-js";
import { Socket } from "socket.io-client";
import Peer from "simple-peer";
import { updateLsideSkeleton } from "../utils/updateLsideSkeleton";
import { updateRsideSkeleton } from "../utils/updateRsideSkeleton";

// 추가: Polyfill import
import 'process/browser';
import { Buffer } from 'buffer';

const pcConfig = {
  iceServers: [
    {
      urls: ["turn:43.203.29.69:3478?transport=tcp"],
      username: "team2",
      credential: "team2",
    },
  ],
};

const useWebRTC = (
  nestjsSocketRef: MutableRefObject<Socket | null>,
  roomName: string,
  leftArmLeftRef: MutableRefObject<Body | null>,
  rightArmRightRef: MutableRefObject<Body | null>,
  canvasSize: { x: number; y: number },
  setIsGameStarted: (isGameStarted: boolean) => void,
  setIsGoalReached: (isGoalReached: boolean) => void,
  setCountdown: (countdown: number) => void,
): WebRTCResult => {
  const peersRef = useRef<PeerObject[]>([]);
  const [peers, setPeers] = useState<PeerObject[]>([]);
  const indexRef = useRef(0);
  const userVideo = useRef<HTMLVideoElement | null>(null);

  const sendLeftHandJoint = (data: any) => {
    console.log("send data: ", data.joint1Start, data.joint1End);
    peersRef.current.forEach((peerObj) => {
      peerObj.peer.send(JSON.stringify({ type: 'left-hand-joint', data }));
    });
  };

  const sendRightHandJoint = (data: any) => {
    console.log("send data: ", data.joint1Start, data.joint1End);
    peersRef.current.forEach((peerObj) => {
      peerObj.peer.send(JSON.stringify({ type: 'right-hand-joint', data }));
    });
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }

        console.log(nestjsSocketRef.current);
        if (nestjsSocketRef.current && nestjsSocketRef.current.id) {
          nestjsSocketRef.current.emit("join-room", roomName);

          nestjsSocketRef.current.on("room-full", () => {
            alert("Room is full!");
            window.location.href = "/";
          });

          nestjsSocketRef.current.on("all-users", (users: string[]) => {
            console.log("All users received: ", users);
            const peers: PeerObject[] = [];
            users.forEach((userID) => {
              console.log("여기 : ", stream);
              const peer = createPeer(userID, nestjsSocketRef.current!.id!, stream);
              const peerObj: PeerObject = { peerID: userID, peer };
              peer.on("data", handleIncomingData);
              peer.on("error", (err) => console.error("Peer error:", err));
              peersRef.current.push(peerObj);
              peers.push(peerObj);
            });
            setPeers(peers);
            indexRef.current = users.length;
            console.log("Peers updated: ", peers);
            console.log("Peers index: ", indexRef.current);
          });

          nestjsSocketRef.current.on("user-joined", (payload: { signal: any; callerID: string }) => {
            const peer = addPeer(payload.signal, payload.callerID, stream);
            const peerObj: PeerObject = { peer, peerID: payload.callerID };
            peer.on("data", handleIncomingData);
            peer.on("error", (err) => console.error("Peer error:", err));
            peersRef.current.push(peerObj);
            setPeers((users) => [...users, peerObj]);
            console.log("User joined: ", payload.callerID);
            console.log("유저 들어옴");
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

          nestjsSocketRef.current!.on("game-started", () => {
            setIsGameStarted(true);
            setIsGoalReached(false);
            setCountdown(3);
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
      channelConfig: {
        ordered: false, // UDP-like behavior
        maxRetransmits: 0,
      },
    });

    console.log("stream created: ", stream);

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
      channelConfig: {
        ordered: false, // UDP-like behavior
        maxRetransmits: 0,
      },
    });

    peer.on("signal", (signal) => {
      nestjsSocketRef.current?.emit("returning-signal", { signal, callerID });
    });

    peer.signal(incomingSignal);
    return peer;
  };

  const handleIncomingData = (data: any) => {
    const parsedData = JSON.parse(data);

    if (parsedData.type === 'left-hand-joint') {
      const { joint1Start, joint1End } = parsedData.data;
      updateLsideSkeleton(leftArmLeftRef, joint1Start, joint1End, canvasSize);
    } else if (parsedData.type === 'right-hand-joint') {
      const { joint1Start, joint1End } = parsedData.data;
      updateRsideSkeleton(rightArmRightRef, joint1Start, joint1End, canvasSize);
    }
  };

  return { userVideo, peers, indexRef, sendLeftHandJoint, sendRightHandJoint };
};

export interface PeerObject {
  peerID: string;
  peer: Peer.Instance;
}

export interface WebRTCResult {
  userVideo: MutableRefObject<HTMLVideoElement | null>;
  peers: PeerObject[];
  indexRef: MutableRefObject<number>;
  sendLeftHandJoint: (data: any) => void;
  sendRightHandJoint: (data: any) => void;
}

export default useWebRTC;