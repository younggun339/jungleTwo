// react-frontend-ts/src/hooks/useWebRTC.ts
import { useEffect, useRef, useState, MutableRefObject } from "react";
import { Body } from "matter-js";
import { Socket } from "socket.io-client";
import Peer from "simple-peer";
import { updateSkeleton } from "../utils/updateSkeleton";
import html2canvas from "html2canvas";
import "process/browser";

const pcConfig = {
  // iceServers: [
  //   {
  //     urls: ["turn:43.203.29.69:3478?transport=tcp"],
  //     username: "team2",
  //     credential: "team2",
  //   },
  // ],
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
  isSimStarted: boolean
): WebRTCResult => {
  const peersRef = useRef<PeerObject[]>([]);
  const [peers, setPeers] = useState<PeerObject[]>([]);
  const indexRef = useRef(0);
  const userVideo = useRef<HTMLVideoElement | null>(null);
  // -------여기서부터 화면 공유 ---------
  // const lastImageData = useRef<string | null>(null);
  // // State to hold the current frame rate, initialized to 10 FPS
  // const [frameRate, setFrameRate] = useState(10); // Initial frame rate in frames per second

  // // Adjust frame rate based on network conditions or other metrics
  // useEffect(() => {
  //   const adjustFrameRate = () => {
  //     // Example of dynamic adjustment
  //     const newRate = Math.random() * (30 - 5) + 5; // Randomly choosing a new rate between 5 and 30 FPS
  //     setFrameRate(newRate);
  //   };

  //   // Adjust every 5 seconds
  //   const intervalId = setInterval(adjustFrameRate, 5000);

  //   return () => clearInterval(intervalId);
  // }, []);

  // useEffect(() => {
  //   const captureAndSend = () => {
  //     // Ensure we capture and send only when indexRef.current is 0
  //     // and other conditions are met
  //     if (indexRef.current !== 0 || !isTutorialImage2End || isSimStarted) {
  //       return;
  //     }

  //     const container = document.getElementById("matter-container");
  //     if (container) {
  //       html2canvas(container, { scale: 1 }).then((canvas) => {
  //         const dataURL = canvas.toDataURL("image/png");

  //         // Only send if the image data has changed
  //         if (lastImageData.current !== dataURL) {
  //           lastImageData.current = dataURL;
  //           peersRef.current.forEach((peerObj) => {
  //             if (peerObj.peer.connected) {
  //               peerObj.peer.send(
  //                 JSON.stringify({ type: "image-data", data: dataURL })
  //               );
  //             }
  //           });
  //         }
  //       });
  //     }
  //   };

  //   // Calculate the interval in milliseconds from the frame rate
  //   const intervalMs = 1000 / frameRate;

  //   // Set interval to capture and send
  //   const intervalId = setInterval(captureAndSend, intervalMs);

  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, [isTutorialImage2End, isSimStarted, frameRate, indexRef.current]); // Ensure indexRef.current is a dependency
  // -------여기까지 화면 공유 ---------
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
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
          console.log(
            `Attempting to join room: ${roomName} with ID: ${nestjsSocketRef.current.id}`
          );
          nestjsSocketRef.current.on("room-full", () => {
            alert("Room is full!");
            window.location.href = "/create-room";
          });

          nestjsSocketRef.current.on("user", (data: string[]) => {
            const element0 = document.getElementById("player0");
            const element1 = document.getElementById("player1");

            element0!.textContent = data[0][1];
            if (data.length == 2) {
              element1!.textContent = data[1][1];
            } else {
              element1!.textContent = "WAITING";
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
              console.log(`User joined: ${payload.callerID}`);
              const peer = addPeer(payload.signal, payload.callerID, stream);
              console.log(
                `Creating peer for newly joined user: ${payload.callerID}`
              );
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
    });

    const sendSignal = (signal: any, retryCount = 0) => {
      nestjsSocketRef.current?.emit(
        "sending-signal",
        {
          userToSignal,
          callerID,
          signal,
        },
        (err: any) => {
          if (err) {
            console.error(`Failed to send signal to ${userToSignal}:`, err);
            if (retryCount >= 10) {
              console.warn("Failed to send signal, retrying...", err);
              setTimeout(() => sendSignal(signal, retryCount + 1), 1000);
            }
          }
        }
      );
    };

    peer.on("signal", sendSignal);

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
    });

    const sendReturnSignal = (signal: any, retryCount = 0) => {
      nestjsSocketRef.current?.emit(
        "returning-signal",
        { signal, callerID },
        (err: any) => {
          if (err && retryCount < 10) {
            console.warn("Failed to send return signal, retrying...", err);
            setTimeout(() => sendReturnSignal(signal, retryCount + 1), 1000);
          }
        }
      );
    };

    peer.on("signal", sendReturnSignal);

    peer.signal(incomingSignal);
    return peer;
  };

  const handleIncomingData = (data: any) => {
    const parsedData = JSON.parse(data);

    if (parsedData.type === "left-hand-joint") {
      const { joint1Start, joint1End } = parsedData.data;
      updateSkeleton(leftArmLeftRef, joint1Start, joint1End);
    } else if (parsedData.type === "right-hand-joint") {
      const { joint1Start, joint1End } = parsedData.data;
      updateSkeleton(rightArmRightRef, joint1Start, joint1End);
    }
    // ---------- 여기서부터 화면 공유
    // else if (parsedData.type === "image-data") {
    //   const canvas = document.getElementById(
    //     "received-canvas"
    //   ) as HTMLCanvasElement;
    //   if (canvas) {
    //     const ctx = canvas.getContext("2d");
    //     const image = new Image();
    //     image.onload = () => {
    //       ctx?.clearRect(0, 0, canvas.width, canvas.height);
    //       ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);
    //     };
    //     image.src = parsedData.data;
    //   }
    // }
    // ---------- 여기까지 화면 공유 ---------
  };

  const sendLeftHandJoint = (joint1Start: any, joint1End: any) => {
    peersRef.current.forEach((peerObj) => {
      peerObj.peer.send(
        JSON.stringify({
          type: "left-hand-joint",
          data: { joint1Start, joint1End },
        })
      );
    });
  };

  const sendRightHandJoint = (joint1Start: any, joint1End: any) => {
    peersRef.current.forEach((peerObj) => {
      peerObj.peer.send(
        JSON.stringify({
          type: "right-hand-joint",
          data: { joint1Start, joint1End },
        })
      );
    });
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
  sendLeftHandJoint: (joint1Start: any, joint1End: any) => void;
  sendRightHandJoint: (joint1Start: any, joint1End: any) => void;
}

export default useWebRTC;
