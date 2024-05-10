// Game2.tsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Engine, Body } from "matter-js";
import { io, Socket } from "socket.io-client";
import useMatterSetup from "../hooks/useMatterSetup";
import Peer from "simple-peer";
import useWebRTC from "../hooks/useWebRTC";
import { resetGameObjects } from "../utils/resetGameObjects";
import { updateLsideSkeleton } from "../utils/updateLsideSkeleton";
import { updateRsideSkeleton } from "../utils/updateRsideSkeleton";
import { Camera } from "@mediapipe/camera_utils";
import { Pose, Results as PoseResults } from '@mediapipe/pose';
import { Hands, Results as HandsResults } from '@mediapipe/hands';
import "../styles/game.css";
import Video from "./Video";

interface PeerObject {
  peerID: string;
  peer: Peer.Instance;
}

interface WebRTCResult {
  userVideo: React.MutableRefObject<HTMLVideoElement | null>;
  peers: PeerObject[];
  indexRef: React.MutableRefObject<number>;
}

const Game2: React.FC = () => {
  const nestjsSocketRef = useRef<Socket | null>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef(Engine.create());
  const canvasSize = { x: 1600, y: 600 };
  const leftArmLeftRef = useRef<Body | null>(null);
  const rightHand1RightRef = useRef<Body | null>(null);
  const rightHand2RightRef = useRef<Body | null>(null);
  const mouseRef = useRef<Body | null>(null);
  const bombRef = useRef<Body | null>(null);
  const webcamRef = useRef<HTMLVideoElement | null>(null);

  // useWebRTC 훅 호출 및 반환 타입 정의
  const { peers, indexRef } = useWebRTC(nestjsSocketRef, "game2", leftArmLeftRef, rightHand1RightRef, rightHand2RightRef, canvasSize) as WebRTCResult;

  useEffect(() => {
    nestjsSocketRef.current = io("http://43.203.29.69:8080/");
  }, []);

  const [showModal, setShowModal] = useState(true);
  const [isSimStarted, setIsSimStarted] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGoalReached, setIsGoalReached] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(3);

  useMatterSetup({
    canvasSize,
    sceneRef,
    engineRef,
    leftArmLeftRef,
    rightHand1RightRef,
    rightHand2RightRef,
    mouseRef,
    bombRef,
    nestjsSocketRef,
  });

  const onHandsResults = useCallback((results: HandsResults) => {
    if (indexRef.current === 1 && results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const hand = results.multiHandLandmarks[0];
      const joint1 = hand[0];
      const joint2 = hand[9];
      const joint3 = hand[12];

      handleRightsideBodyCoords(
        { x: joint1.x, y: joint1.y },
        { x: joint2.x, y: joint2.y },
        { x: joint3.x, y: joint3.y }
      );
    }
  }, [indexRef, peers]);

  const onPoseResults = useCallback((results: PoseResults) => {
    if (indexRef.current === 0 && results.poseLandmarks && results.poseLandmarks.length > 0) {
      const landmarks = results.poseLandmarks;
      const joint1 = landmarks[15];
      const joint2 = landmarks[13];

      handleLeftsideBodyCoords(
        { x: joint1.x, y: joint1.y },
        { x: joint2.x, y: joint2.y }
      );
    }
  }, [indexRef, peers]);

  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    hands.onResults(onHandsResults);

    const pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults(onPoseResults);

    if (webcamRef.current) {
      const camera = new Camera(webcamRef.current, {
        onFrame: async () => {
          await hands.send({ image: webcamRef.current! });
          await pose.send({ image: webcamRef.current! });
        },
        width: 800,
        height: 600,
      });
      camera.start();
    }
  }, [onHandsResults, onPoseResults]);

  const handleLeftsideBodyCoords = (joint1Start: any, joint1End: any) => {
    if (indexRef.current === 0) {
      updateLsideSkeleton(leftArmLeftRef, joint1Start, joint1End, canvasSize);
      const peer = peers.find(peer => peer.peerID !== nestjsSocketRef.current?.id);
      if (peer) {
        nestjsSocketRef.current?.emit("send-left-hand-joint", {
          joint1Start,
          joint1End,
          receiverID: peer.peerID
        });
      }
    }
  };

  const handleRightsideBodyCoords = (joint1: any, joint2: any, joint3: any) => {
    if (indexRef.current === 1) {
      updateRsideSkeleton(rightHand1RightRef, joint1, joint2, canvasSize);
      updateRsideSkeleton(rightHand2RightRef, joint2, joint3, canvasSize);
      const peer = peers.find(peer => peer.peerID !== nestjsSocketRef.current?.id);
      if (peer) {
        nestjsSocketRef.current?.emit("send-right-hand-joint", {
          joint1,
          joint2,
          joint3,
          receiverID: peer.peerID
        });
      }
    }
  };

  useEffect(() => {
    if (
      isSimStarted &&
      leftArmLeftRef.current &&
      rightHand1RightRef.current &&
      rightHand2RightRef.current &&
      leftArmLeftRef.current.vertices.length > 1 &&
      rightHand1RightRef.current.vertices.length > 1 &&
      rightHand2RightRef.current.vertices.length > 1
    ) {
      const fixedRef1 = {
        x: leftArmLeftRef.current.position.x,
        y: leftArmLeftRef.current.position.y,
        width: Math.abs(leftArmLeftRef.current.vertices[1].x - leftArmLeftRef.current.vertices[0].x),
        angle: leftArmLeftRef.current.angle,
      };
      const fixedRef2 = {
        x: rightHand1RightRef.current.position.x,
        y: rightHand1RightRef.current.position.y,
        width: Math.abs(rightHand1RightRef.current.vertices[1].x - rightHand1RightRef.current.vertices[0].x),
        angle: rightHand1RightRef.current.angle,
      };
      const fixedRef3 = {
        x: rightHand2RightRef.current.position.x,
        y: rightHand2RightRef.current.position.y,
        width: Math.abs(rightHand2RightRef.current.vertices[1].x - rightHand2RightRef.current.vertices[0].x),
        angle: rightHand2RightRef.current.angle,
      };
  
      fetch("/simulation-start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fixedRef1,
          fixedRef2,
          fixedRef3,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.isBombed) {
            explodeBomb();
          }
          if (data.isGameClear) {
            winGame();
          } else {
            loseGame();
          }
        })
        .catch((error) => console.error("Error sending simulation start:", error));
    }
  }, [isSimStarted]);

  useEffect(() => {
    if (isSimStarted) {
      const handleMouseJourney = (data: any) => {
        Body.setPosition(mouseRef.current!, { x: data.mousePos.x, y: data.mousePos.y });
        Body.setPosition(bombRef.current!, { x: data.bombPos.x, y: data.bombPos.y });
        Body.setAngle(bombRef.current!, data.bombAngle);
      };

      nestjsSocketRef.current?.on("mouse-journey", handleMouseJourney);

      return () => {
        nestjsSocketRef.current?.off("mouse-journey", handleMouseJourney);
      };
    }
  }, [isSimStarted]);

  useEffect(() => {
    if (isGameStarted && countdown && countdown > 0) {
      const interval = setInterval(() => {
        setCountdown((prevCount) => (prevCount ? prevCount - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    } else if (countdown === 0) {
      setIsSimStarted(true);
      setCountdown(null);
    }
  }, [isGameStarted, countdown]);

  const startGame = () => {
    setIsGoalReached(false);
    setCountdown(3);
    setIsGameStarted(true);
    setShowModal(false);
  };

  const explodeBomb = () => console.log("bomb exploded");
  const winGame = () => {
    alert("game cleared");
    resetGameObjects(mouseRef, bombRef, setIsSimStarted, setIsGameStarted);
  };
  const loseGame = () => {
    alert("game over");
    resetGameObjects(mouseRef, bombRef, setIsSimStarted, setIsGameStarted);
  };

  return (
    <div className="App">
      <div id="matter-container" ref={sceneRef}>
        {peers.slice(0, indexRef.current).map((peer, index) => (
          <Video
            key={`${peer.peerID}-${index}`}
            peer={peer.peer}
            myIndexRef={indexRef.current}
          />
        ))}

        <video
          id={indexRef.current === 0 ? "video-container-1" : "video-container-2"}
          muted
          ref={webcamRef}
          autoPlay
          playsInline
          style={{ order: indexRef.current }}
        />

        {peers.slice(indexRef.current).map((peer, index) => (
          <Video
            key={`${peer.peerID}-${index}`}
            peer={peer.peer}
            myIndexRef={indexRef.current}
          />
        ))}
      </div>

      {isGameStarted && countdown && countdown > 0 && <div id="countdown">{countdown}</div>}
      {!isGameStarted && (
        <button onClick={startGame} id="start-button">
          Start Game
        </button>
      )}
    </div>
  );
};

export default Game2;
