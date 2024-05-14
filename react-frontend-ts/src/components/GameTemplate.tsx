// Game2.tsx

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Engine, Body } from "matter-js";
import { io, Socket } from "socket.io-client";
import useMatterSetup from "../hooks/useMatterSetupTemplate";
import useWebRTC, { WebRTCResult } from "../hooks/useWebRTC";
import useMediapipe from "../hooks/useMediapipe";
import useTensorFlow from "../hooks/useTensorFlow";
import { updateLsideSkeleton } from "../utils/updateLsideSkeleton";
import { updateRsideSkeleton } from "../utils/updateRsideSkeleton";
import Video from "./Video";
import "../styles/game.css";

interface Game2Props {
  userName: string;
}

const Game2: React.FC<Game2Props> = ({ userName }) => {
  const nestjsSocketRef = useRef<Socket | null>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef(Engine.create());
  const canvasSize = { x: 1600, y: 600 };
  const leftArmLeftRef = useRef<Body | null>(null);
  const rightArmRightRef = useRef<Body | null>(null);
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
  const [isPlayer1Ready, setIsPlayer1Ready] = useState(false);
  const [isPlayer2Ready, setIsPlayer2Ready] = useState(false);

  useEffect(() => {
    nestjsSocketRef.current = io("https://zzrot.store/");
    nestjsSocketRef.current.emit("user-signal", { gameRoomID, userName });
  }, []);

  const startGame = () => {
    console.log("if 전: ", isGameStarted);
    if (!isGameStarted) {
      setIsGameStarted(true);
      setIsGoalReached(false);
      console.log("if 후: ", isGameStarted);
      setCountdown(3);
      setShowModal(false);

      if (nestjsSocketRef.current) {
        nestjsSocketRef.current.emit('start-game', { roomId: gameRoomId });
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
      userName,
    ) as WebRTCResult;


  if (isPlayer1Ready && isPlayer2Ready) {
    useMatterSetup(
      canvasSize,
      sceneRef,
      engineRef,
      leftArmLeftRef,
      rightArmRightRef,
      nestjsSocketRef,
      setIsSimStarted,
      setIsGameStarted,
      setIsGoalReached,
    );
  }

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

  type CoordsData = {
    joint1Start: { x: number; y: number };
    joint1End: { x: number; y: number };
  };

  // =============== 게임 시작 이벤트 ===============
  // 왼팔 및 오른팔 사각형의 위치를 매 프레임마다 업데이트

  useEffect(() => {
    const handleLeftsideBodyCoords = (data: CoordsData) => {
      const { joint1Start, joint1End } = data;
      updateLsideSkeleton(leftArmLeftRef, joint1Start, joint1End, canvasSize);
    };
    const handleRightsideBodyCoords = (data: CoordsData) => {
      const { joint1Start, joint1End } = data;
      updateRsideSkeleton(rightArmRightRef, joint1Start, joint1End, canvasSize);
    };

    if (!isGameStarted) {
      nestjsSocketRef.current?.on("body-coords-L", handleLeftsideBodyCoords);
      nestjsSocketRef.current?.on("body-coords-R", handleRightsideBodyCoords);
    } else {
      nestjsSocketRef.current?.off("body-coords-L", handleLeftsideBodyCoords);
      nestjsSocketRef.current?.off("body-coords-R", handleRightsideBodyCoords);
    }

    const fixedRef1 = {
      x: leftArmLeftRef.current?.position.x ?? 0,
      y: leftArmLeftRef.current?.position.y ?? 0,
      width:
        (leftArmLeftRef.current?.vertices[1]?.x ?? 0) -
        (leftArmLeftRef.current?.vertices[0]?.x ?? 0),
      height:
        (leftArmLeftRef.current?.vertices[1]?.y ?? 0) -
        (leftArmLeftRef.current?.vertices[0]?.y ?? 0),
      angle: leftArmLeftRef.current?.angle ?? 0,
    };
    const fixedRef2 = {
      x: rightArmRightRef.current?.position.x ?? 0,
      y: rightArmRightRef.current?.position.y ?? 0,
      width:
        (rightArmRightRef.current?.vertices[1]?.x ?? 0) -
        (rightArmRightRef.current?.vertices[0]?.x ?? 0),
      height:
        (rightArmRightRef.current?.vertices[1]?.y ?? 0) -
        (rightArmRightRef.current?.vertices[0]?.y ?? 0),
      angle: rightArmRightRef.current?.angle ?? 0,
    };

    fetch("/simulation-start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fixedRef1,
        fixedRef2,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) =>
        console.error("Error sending simulation start:", error)
      );

    return () => {
      nestjsSocketRef.current?.off("body-coords-L", handleLeftsideBodyCoords);
      nestjsSocketRef.current?.off("body-coords-R", handleRightsideBodyCoords);
    };
  }, [isGameStarted]);

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
