// allroom.jsx
import React, { useEffect, useRef, useState } from "react";
import { Engine, Body } from "matter-js";
import io from "socket.io-client";
import useMatterSetup from "../hooks/useMatterSetup";
import useWebRTC from "../hooks/useWebRTC";
import startCapturing from './startCapturing';
import { resetGameObjects } from "../utils/resetGameObjects";
import { updateLsideSkeleton } from "../utils/updateLsideSkeleton";
import { updateRsideSkeleton } from "../utils/updateRsideSkeleton";
import "../styles/game.css";

const Video = (props) => {
  const ref = useRef(null);
  useEffect(() => {
    const peer = props.peer;

    peer.on("stream", stream => {
      ref.current.srcObject = stream;
  
      startCapturing(stream, props.flaskSocketRef, props.canvasRef, props.indexRef);
    });

    return () => {
      peer.removeAllListeners("stream");
    };
  }, [props.peer]);

  return (
    <video id={props.myIndexRef === 0 ? 'video-container-2' : 'video-container-1'} autoPlay playsInline ref={ref} />
  );
}

function Game2() {
  const flaskSocketRef = useRef(null);
  const nestjsSocketRef = useRef(null);

  const sceneRef = useRef(null);
  const engineRef = useRef(Engine.create());
  const canvasSize = { x: 1600, y: 600 };
  const leftArmLeftRef = useRef(null);
  const rightHand1RightRef = useRef(null);
  const rightHand2RightRef = useRef(null);
  const mouseRef = useRef(null);
  const bombRef = useRef(null);
  const canvasRef = useRef(null); // 캔버스 태그 참조

  useEffect(() => {
    flaskSocketRef.current = io("http://43.203.29.69");
    nestjsSocketRef.current = io("http://43.203.29.69/mouse-journey");
  }, []);
  
  const [showModal, setShowModal] = useState(true);
  const [isSimStarted, setIsSimStarted] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGoalReached, setIsGoalReached] = useState(false);
  const [countdown, setCountdown] = useState(3);
  
  const { userVideo, peers, indexRef } = useWebRTC(flaskSocketRef, "game2", canvasRef, setIsGoalReached, setCountdown, setIsGameStarted, setShowModal);
  useMatterSetup(
    {
      canvasSize,
      sceneRef,
      engineRef,
      leftArmLeftRef,
      rightHand1RightRef,
      rightHand2RightRef,
      mouseRef,
      bombRef,
      flaskSocketRef,
      nestjsSocketRef
    }
  );

  useEffect(() => {
    const handleLeftsideBodyCoords = (data) => {
      const { joint1Start, joint1End } = data;
      updateLsideSkeleton(leftArmLeftRef, joint1Start, joint1End, canvasSize);
    };
    const handleRightsideBodyCoords = (data) => {
      const { joint1, joint2, joint3 } = data;
      updateRsideSkeleton(rightHand1RightRef, joint1, joint2, canvasSize);
      updateRsideSkeleton(rightHand2RightRef, joint2, joint3, canvasSize);
    };

    if (!isSimStarted) {
      flaskSocketRef.current.on("body-coords-L", handleLeftsideBodyCoords);
      flaskSocketRef.current.on("body-coords-R", handleRightsideBodyCoords);
    } else {
      flaskSocketRef.current.off("body-coords-L", handleLeftsideBodyCoords);
      flaskSocketRef.current.off("body-coords-R", handleRightsideBodyCoords);
    }

    return () => {
      flaskSocketRef.current.off("body-coords-L", handleLeftsideBodyCoords);
      flaskSocketRef.current.off("body-coords-R", handleRightsideBodyCoords);
    };
  }, [isSimStarted]);

  // 시뮬레이션 시작 이벤트 -> nestJS 서버로 스켈레톤 추출 지형을 전송
  useEffect(() => {
    if (isSimStarted) {
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
          console.log("Simulation start response:", data);
          if (data.isBombed) {
            explodeBomb();
          }
          if (data.isGameClear) {
            winGame();
          } else {
            loseGame();
          }
        })
        .catch((error) =>
          console.error("Error sending simulation start:", error)
        );
    }
  }, [isSimStarted]);

  // 쥐 위치 및 폭탄의 위치 및 각도를 매 프레임마다 업데이트
  useEffect(() => {
    if (isSimStarted) {
      const handleMouseJourney = (data) => {
        console.log(data)
        console.log("mouse x: ", data.mousePos.x)
        console.log("mouse y: ", data.mousePos.y)
        Body.setPosition(mouseRef.current, { x: data.mousePos.x, y: data.mousePos.y });
        Body.setPosition(bombRef.current, { x: data.bombPos.x, y: data.bombPos.y });
        Body.setAngle(bombRef.current, data.bombAngle);
      };

      nestjsSocketRef.current.on("mouse-journey", handleMouseJourney);

      return () => {
        nestjsSocketRef.current.off("mouse-journey", handleMouseJourney);
      };
    }
  }, [isSimStarted]);
  // ==============================================

  useEffect(() => {
    if (isGameStarted && countdown > 0) {
      const interval = setInterval(() => {
        setCountdown((prevCount) => prevCount - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (countdown === 0) {
      setIsSimStarted(true);
      setCountdown(null);
    }
  }, [isGameStarted, countdown]);

  const startGame = () => {
    flaskSocketRef.current.emit("start-game");
    setIsGoalReached(false);
    setCountdown(3);
    setIsGameStarted(true);
    setShowModal(false);
  };

  const explodeBomb = () => {
    console.log("bomb exploded");
  };
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
      <div id="matter-container" ref={sceneRef}></div>
      {
        peers.slice(0, indexRef.current).map((peer, index) => (
            <Video key={`${peer.peerID}-${index}`} peer={peer.peer} canvasRef={canvasRef.current} myIndexRef={indexRef.current} flaskSocketRef={flaskSocketRef.current}/>
        ))}
      
      {
          <video id={indexRef.current === 0 ? 'video-container-1' : 'video-container-2'} muted ref={userVideo} autoPlay playsInline style={{ order: indexRef.current }} />
      }
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {
        peers.slice(indexRef.current).map((peer, index) => (
            <Video key={`${peer.peerID}-${index}`} peer={peer.peer} canvasRef={canvasRef.current} myIndexRef={indexRef.current} flaskSocketRef={flaskSocketRef.current}/>
        ))}
      {isGameStarted && countdown > 0 && (
        <div id="countdown">{countdown}</div>
      )}
      {!isGameStarted && /*isLeftCamLoaded && isRightCamLoaded &&*/ (
        <button onClick={startGame} id="start-button">
          Start Game
        </button>
      )}
      {/* {
        !isLeftCamLoaded && !isRightCamLoaded && (
          <div id="loading-overlay">Loading...</div>
        )
      } */}
    </div>
  );
}

export default Game2;