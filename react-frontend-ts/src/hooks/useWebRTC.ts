import { useEffect, useRef, useState, MutableRefObject } from "react";
import { Body } from "matter-js";
import { Socket } from "socket.io-client";
import Peer from "simple-peer";
import { updateLsideSkeleton, updateRsideSkeleton } from "../utils/updateSkeleton";

// 추가: Polyfill import
import "process/browser";
import startCapturing from "../components/startCapturing";

const pcConfig = {
  iceServers: [
    {
      urls: ["turn:43.203.29.69:3478?transport=tcp"],
      username: "team2",
      credential: "team2",
    },
  ],
};

const retryFetch = async (url: any, options: any, retries = 50) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
    }
  }
};

const useWebRTC = (
  nestjsSocketRef: MutableRefObject<Socket | null>,
  flaskSocketRef: MutableRefObject<Socket | null>,
  roomName: string,
  leftArmLeftRef: MutableRefObject<Body | null>,
  rightArmRightRef: MutableRefObject<Body | null>,
  canvasSize: { x: number; y: number },
  canvasRef: MutableRefObject<HTMLCanvasElement | null>,
  userName: string,
  isTutorialImage2End: boolean,
  isSimStarted: boolean,
): WebRTCResult => {
  const peersRef = useRef<PeerObject[]>([]);
  const [peers, setPeers] = useState<PeerObject[]>([]);
  const indexRef = useRef(0);
  const userVideo = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }

        if (nestjsSocketRef.current && nestjsSocketRef.current.id) {
          nestjsSocketRef.current.on("delete", async (data: string) => {
            try {
              await retryFetch("https://zzrot.store/room/delete", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ room_id: data }),
              });
            } catch (error) {
              console.error("Fetch failed after retries", error);
            }
          });

          nestjsSocketRef.current.emit("join-room", roomName);

          nestjsSocketRef.current.on("room-full", () => {
            alert("Room is full!");
            window.location.href = "/";
          });

          nestjsSocketRef.current.on("user", (data: string[]) => {
            const element0 = document.getElementById("player0");
            const element1 = document.getElementById("player1");
            element0!.textContent = data[0][1];
            if (data.length == 2) {
              element1!.textContent = data[1][1];
            } else {
              element1!.textContent = "기다리는 중...";
            }
          });

          nestjsSocketRef.current.on("all-users", (users: string[]) => {
            const peers: PeerObject[] = [];
            users.forEach((userID) => {
              const peer = createPeer(
                userID,
                nestjsSocketRef.current!.id!,
                stream
              );
              const peerObj: PeerObject = { peerID: userID, peer };
              peer.on("data", handleIncomingData);
              peer.on("error", (err) => console.error("Peer error:", err));
              peersRef.current.push(peerObj);
              peers.push(peerObj);
            });
            setPeers(peers);
            indexRef.current = users.length;
          });

          nestjsSocketRef.current.on(
            "user-joined",
            (payload: { signal: any; callerID: string }) => {
              const peer = addPeer(payload.signal, payload.callerID, stream);
              const peerObj: PeerObject = { peer, peerID: payload.callerID };
              peer.on("data", handleIncomingData);
              peer.on("error", (err) => console.error("Peer error:", err));
              peersRef.current.push(peerObj);
              setPeers((users) => [...users, peerObj]);
            }
          );

          nestjsSocketRef.current.on(
            "receiving-returned-signal",
            (payload: { id: string; signal: any }) => {
              const item = peersRef.current.find(
                (p) => p.peerID === payload.id
              );
              if (item) item.peer.signal(payload.signal);
            }
          );

          nestjsSocketRef.current.on("user-left", (id: string) => {
            const peerObj = peersRef.current.find((p) => p.peerID === id);
            if (peerObj) peerObj.peer.destroy();
            const peers = peersRef.current.filter((p) => p.peerID !== id);
            peersRef.current = peers;
            setPeers(peers);
          });

          nestjsSocketRef.current!.on("game-started", () => {
            // setIsGameStarted(true);
            // setIsGoalReached(false);
            // setCountdown(3);
          });
        }
      });
  }, [roomName]);

  const createPeer = (
    userToSignal: string,
    callerID: string,
    stream: MediaStream
  ): Peer.Instance => {
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

  const addPeer = (
    incomingSignal: any,
    callerID: string,
    stream: MediaStream
  ): Peer.Instance => {
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

    if (parsedData.type === "left-hand-joint") {
      const { joint1Start, joint1End } = parsedData.data;
      updateLsideSkeleton(leftArmLeftRef, joint1Start, joint1End, canvasSize);
    } else if (parsedData.type === "right-hand-joint" ) {
      const { joint1Start, joint1End } = parsedData.data;
      updateRsideSkeleton(rightArmRightRef, joint1Start, joint1End, canvasSize);
    }
  };

  const sendLeftHandJoint = (joint1Start: any, joint1End: any) => {
    peersRef.current.forEach((peerObj) => {
      peerObj.peer.send(JSON.stringify({ type: "left-hand-joint", data: { joint1Start, joint1End } }));
    });
  };

  const sendRightHandJoint = (joint1Start: any, joint1End: any) => {
    peersRef.current.forEach((peerObj) => {
      peerObj.peer.send(JSON.stringify({ type: "right-hand-joint", data: { joint1Start, joint1End } }));
    });
  };

  // useEffect(() => {
  //   let stopCapturing: (() => void) | undefined;
  
  //   if (isTutorialImage2End && !isSimStarted) {
  //     stopCapturing = startCapturing(
  //       userVideo,
  //       canvasRef,
  //       flaskSocketRef,
  //       indexRef,
  //       isSimStarted,
  //     );
  //   }
  
  //   return () => {
  //     if (stopCapturing) {
  //       stopCapturing();
  //     }
  //   };
  // }, [isTutorialImage2End, isSimStarted]);

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
  sendLeftHandJoint: (joint1Start: any, joint1End: any) => void;
  sendRightHandJoint: (joint1Start: any, joint1End: any) => void;
}

export default useWebRTC;
