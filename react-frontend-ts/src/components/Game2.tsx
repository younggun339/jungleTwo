// Game2.tsx

import React, { useEffect, useRef, useState } from "react";
import { useParams } from 'react-router-dom';
import { Engine, Body } from "matter-js";
import { io, Socket } from "socket.io-client";
import useMatterSetup from "../hooks/useMatterSetup";
import useWebRTC, { WebRTCResult } from '../hooks/useWebRTC';
import useMediapipe from "../hooks/useMediapipe";
import useSimulation from "../hooks/useSimulation";
import { resetGameObjects } from "../utils/resetGameObjects";
import Video from "./Video";
import "../styles/game.css";


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
  // TODO: userParam으로 "game/"+id 이렇게 바꿔야댐
  // const gameRoomId = "game";
  const { gameRoomID } = useParams<{ gameRoomID: string }>();
  const gameRoomId = "game/" + gameRoomID;
  console.log(gameRoomId);

  useEffect(() => {
    nestjsSocketRef.current = io("http://43.203.29.69:8080/");
  }, []);

  const startGame = () => {
    console.log("if 전: ", isGameStarted);
    if (!isGameStarted) {
      setIsGameStarted(true); // <--
      setIsGoalReached(false);
      console.log("if 후: ", isGameStarted);
      setCountdown(3);
      setShowModal(false);
      
      if (nestjsSocketRef.current) {
        // nestjsSocketRef.current.emit('start-game', { roomId: gameRoomId });
      }
    }
  };

  const { peers, indexRef, sendLeftHandJoint, sendRightHandJoint } = useWebRTC(
    nestjsSocketRef, 
    gameRoomId, 
    leftArmLeftRef, 
    rightHand1RightRef, 
    rightHand2RightRef, 
    canvasSize, 
    startGame
  ) as WebRTCResult;

  const [showModal, setShowModal] = useState(true);
  const [isSimStarted, setIsSimStarted] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGoalReached, setIsGoalReached] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(3);
  const [isRightCamLoaded, setIsRightCamLoaded] = useState(false);

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

  useMediapipe({
    webcamRef,
    indexRef,
    peers,
    sendLeftHandJoint,
    sendRightHandJoint,
    leftArmLeftRef,
    rightHand1RightRef,
    rightHand2RightRef,
    canvasSize
  });

  useSimulation({
    isSimStarted,
    leftArmLeftRef,
    rightHand1RightRef,
    rightHand2RightRef,
    mouseRef,
    bombRef,
    nestjsSocketRef,
    explodeBomb: () => console.log("bomb exploded"),
    winGame: () => {
      alert("game cleared");
      resetGameObjects(mouseRef, bombRef, setIsSimStarted, setIsGameStarted);
    },
    loseGame: () => {
      alert("game over");
      resetGameObjects(mouseRef, bombRef, setIsSimStarted, setIsGameStarted);
    },
  });

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

  return (
    <div className="App">
      <div id="matter-container" ref={sceneRef}>
        {peers.slice(0, indexRef.current).map((peer, index) => (
          <Video
            key={`${peer.peerID}-${index}`}
            peer={peer.peer}
            peers={peers}
            myIndexRef={1}
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
            peers={peers}
            myIndexRef={0}
            onLoaded={() => setIsRightCamLoaded(true)}
          />
        ))}
      </div>

      {isGameStarted && countdown && countdown > 0 && <div id="countdown">{countdown}</div>}
      {!isGameStarted && (
        <button onClick={startGame} id="start-button">
          Start Game
        </button>
      )}
      {/* {!isRightCamLoaded && (
        <div id="loading-overlay">Loading...</div>
      )} */}
    </div>
  );
};

export default Game2;