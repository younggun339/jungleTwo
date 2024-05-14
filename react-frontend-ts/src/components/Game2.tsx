// Game2.tsx

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Engine, Body } from "matter-js";
import { io, Socket } from "socket.io-client";
import useMatterSetup from "../hooks/useMatterSetup";
import useWebRTC, { WebRTCResult } from "../hooks/useWebRTC";
import useMediapipe from "../hooks/useMediapipe";
import useTensorFlow from "../hooks/useTensorFlow";
import useSimulation from "../hooks/useSimulation";
import { resetGameObjects } from "../utils/resetGameObjects";
import Video from "./Video";
import "../styles/game.css";

interface Game2Props {
  userName: string;
}

const Game2: React.FC<Game2Props> = ({ userName }) => {
  const nestjsSocketRef = useRef<Socket | null>(null);
  const flaskSocketRef = useRef<Socket | null>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef(Engine.create());
  const canvasSize = { x: 1600, y: 600 };
  const leftArmLeftRef = useRef<Body | null>(null);
  const rightArmRightRef = useRef<Body | null>(null);
  const mouseRef = useRef<Body | null>(null);
  const bombRef = useRef<Body | null>(null);
  // TODO: userParam으로 "game/"+id 이렇게 바꿔야댐
  // const gameRoomId = "game";
  const { gameRoomID } = useParams<{ gameRoomID: string }>();
  const gameRoomId = "game/" + gameRoomID;

  const [showModal, setShowModal] = useState(true);
  const [isSimStarted, setIsSimStarted] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGoalReached, setIsGoalReached] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(3);
  const [isRightCamLoaded, setIsRightCamLoaded] = useState(false);
  const [isMyCamLoaded, setIsMyCamLoaded] = useState(false);

  useEffect(() => {
    nestjsSocketRef.current = io("https://zzrot.store/");
    nestjsSocketRef.current.emit("user-signal", { gameRoomID, userName });
  }, []);

  useEffect(() => {
    if (flaskSocketRef.current) {
      flaskSocketRef.current.disconnect();
    }
    flaskSocketRef.current = io("https://zzrot.store/socket.io/mediapipe/", {
      path: "/socket.io/mediapipe/",
      transports: ["websocket"],
    });
    flaskSocketRef.current.emit("flask-connect", () => {
      console.log("flask socket connected");
    });
    return () => {
      // 컴포넌트 언마운트 시 소켓 연결 닫기
      if (flaskSocketRef.current && flaskSocketRef.current.connected) {
        flaskSocketRef.current.disconnect();
      }
    };
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

  const { userVideo, peers, indexRef, sendLeftHandJoint, sendRightHandJoint } =
    useWebRTC(
      nestjsSocketRef,
      gameRoomId,
      leftArmLeftRef,
      rightArmRightRef,
      canvasSize,
      setIsGameStarted,
      setIsGoalReached,
      setCountdown,
      userName
    ) as WebRTCResult;

  useMatterSetup({
    canvasSize,
    sceneRef,
    engineRef,
    leftArmLeftRef,
    rightArmRightRef,
    mouseRef,
    bombRef,
    nestjsSocketRef,
  });

  // useMediapipe({
  //   userVideo,
  //   indexRef,
  //   peers,
  //   sendLeftHandJoint,
  //   sendRightHandJoint,
  //   leftArmLeftRef,
  //   rightArmRightRef,
  //   canvasSize,
  // });

  useSimulation({
    isSimStarted,
    leftArmLeftRef,
    rightArmRightRef,
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
          id={
            indexRef.current === 0 ? "video-container-1" : "video-container-2"
          }
          muted
          ref={userVideo}
          autoPlay
          playsInline
          style={{ order: indexRef.current }}
          onLoadedData={() => setIsMyCamLoaded(true)}
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

      {isGameStarted && countdown && countdown > 0 && (
        <div id="countdown">{countdown}</div>
      )}
      {!isGameStarted && (
        <button onClick={startGame} id="start-button">
          Start Game
        </button>
      )}

      <footer className="footer">
        <div id="player0">기다리는 중...</div>
        <div id="player1">기다리는 중...</div>
      </footer>
    </div>
  );
};

export default Game2;
