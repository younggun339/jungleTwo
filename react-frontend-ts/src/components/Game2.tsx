// Game2.tsx
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Engine, Body } from "matter-js";
import { io, Socket } from "socket.io-client";
import useMatterSetup from "../hooks/useMatterSetup";
import useWebRTC, { WebRTCResult } from "../hooks/useWebRTC";
import { updateLsideSkeleton } from "../utils/updateLsideSkeleton";
import { updateRsideSkeleton } from "../utils/updateRsideSkeleton";
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
  const canvasRef = useRef(null);
  const leftArmLeftRef = useRef<Body | null>(null);
  const rightArmRightRef = useRef<Body | null>(null);
  const { gameRoomID } = useParams<{ gameRoomID: string | undefined }>();
  if (!gameRoomID) {
    throw new Error("gameRoomID is required but was not provided");
  }

  const [showModal, setShowModal] = useState(true);
  const [countdown, setCountdown] = useState<number | null>(3);
  const [isRightCamLoaded, setIsRightCamLoaded] = useState(false);
  const [isMyCamLoaded, setIsMyCamLoaded] = useState(false);

  const [isSimStarted, setIsSimStarted] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGoalReached, setIsGoalReached] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  // 인게임 및 통신 관련 소켓
  useEffect(() => {
    nestjsSocketRef.current = io("https://zzrot.store/", {
      path: "/nestSocket",
    });

    nestjsSocketRef.current.on("connect", () => {
      nestjsSocketRef.current?.emit("user-signal", { gameRoomID, userName });
    });
  }, []);

  // mediapipie 관련 소켓
  useEffect(() => {
    if (flaskSocketRef.current) {
      flaskSocketRef.current.disconnect();
    }
    flaskSocketRef.current = io("https://zzrot.store/", {
      path: "/flaskSocket",
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

  const readyGame = () => {
    if (nestjsSocketRef.current) {
      nestjsSocketRef.current.emit("ready-game", {
        roomName: gameRoomID,
        userName,
      });
      setIsPlayerReady(true);
    }
  };

  useEffect(() => {
    if (nestjsSocketRef.current) {
      nestjsSocketRef.current.on(
        "response-ready",
        (players: [string, string, boolean][]) => {
          const readyPlayers = players.filter(
            (player: [string, string, boolean]) => player[2] === true
          );
          if (readyPlayers.length === 2) {
            alert("all users are ready!");
            setIsGameStarted(true);
            setIsGoalReached(false);
            setCountdown(3);
          }
        }
      );
    }
  }, []);

  const { userVideo, peers, indexRef, sendLeftHandJoint, sendRightHandJoint } =
    useWebRTC(
      nestjsSocketRef,
      flaskSocketRef,
      gameRoomID,
      leftArmLeftRef,
      rightArmRightRef,
      canvasSize,
      canvasRef,
      userName
    ) as WebRTCResult;

  useMatterSetup(
    {
      canvasSize,
      sceneRef,
      engineRef,
      leftArmLeftRef,
      rightArmRightRef,
      nestjsSocketRef,
      isSimStarted,
    },
    setIsSimStarted,
    setIsGameStarted,
    setIsGoalReached
  );

  // =============== 게임 시작 이벤트 ===============
  // 왼팔 및 오른팔 사각형의 위치를 매 프레임마다 업데이트
  interface BodyCoordsL {
    joint1Start: { x: number; y: number };
    joint1End: { x: number; y: number };
  }

  interface BodyCoordsR {
    joint1Start: { x: number; y: number };
    joint1End: { x: number; y: number };
  }

  useEffect(() => {
    const handleLeftsideBodyCoords = (data: BodyCoordsL) => {
      const { joint1Start, joint1End } = data;
      console.log("joint1Start: ", joint1Start.x, "joint1End: ", joint1End.x);
      updateLsideSkeleton(leftArmLeftRef, joint1Start, joint1End, canvasSize);
      sendLeftHandJoint({ joint1Start, joint1End });
    };

    const handleRightsideBodyCoords = (data: BodyCoordsR) => {
      const { joint1Start, joint1End } = data;
      updateRsideSkeleton(rightArmRightRef, joint1Start, joint1End, canvasSize);
      sendRightHandJoint({ joint1Start, joint1End });
    };

    if (!isSimStarted && indexRef.current === 0) {
      flaskSocketRef.current?.on("body-coords-R", handleLeftsideBodyCoords);
    } else if (!isSimStarted && indexRef.current === 1) {
      flaskSocketRef.current?.on("body-coords-L", handleRightsideBodyCoords);
    } else if (isSimStarted) {
      flaskSocketRef.current?.off("body-coords-L", handleLeftsideBodyCoords);
      flaskSocketRef.current?.off("body-coords-R", handleRightsideBodyCoords);
    }

    return () => {
      flaskSocketRef.current?.off("body-coords-L", handleLeftsideBodyCoords);
      flaskSocketRef.current?.off("body-coords-R", handleRightsideBodyCoords);
    };
  }, [isSimStarted, indexRef.current]);

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
        <canvas ref={canvasRef} style={{ display: "none" }} />
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
      {!isPlayerReady && (
        <button onClick={readyGame} id="start-button">
          준비 완료
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
