// Game2.jsx
import React, { useEffect, useRef, useState  } from "react";
import { Engine, Body, Events } from "matter-js";
import io from "socket.io-client";
import useMatterSetup from "../hooks/useMatterSetup";
import { updateLsideSkeleton } from "../utils/updateLsideSkeleton";
import { updateRsideSkeleton } from "../utils/updateRsideSkeleton";
import "../styles/game.css";

function Game2() {

  const sceneRef = useRef(null);
  const videoRef = useRef(null);
  const engineRef = useRef(Engine.create());

  const canvasSize = { x: 1600, y: 600 };
  const leftArmLeftRef = useRef(null);
  const rightHand1RightRef = useRef(null);
  const rightHand2RightRef = useRef(null);
  const mouseRef = useRef(null);
  const bombRef = useRef(null);

  const [isLeftCamLoaded, setIsLeftCamLoaded] = useState(false);
  const [isRightCamLoaded, setIsRightCamLoaded] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isIngameStarted, setIsIngameStarted] = useState(false);
  const [isGoalReached, setIsGoalReached] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const socketRef = useRef(null);
  useEffect(() => {
    socketRef.current = io("https://localhost:5000");
  }, []);

  useMatterSetup({
    canvasSize,
    sceneRef,
    videoRef,
    engineRef,
    leftArmLeftRef,
    rightHand1RightRef,
    rightHand2RightRef,
    mouseRef,
    bombRef,
    socketRef,
  }, setIsGoalReached, setIsGameStarted, setIsIngameStarted);

  // =============== 게임 시작 이벤트 ===============
  // 왼팔 및 오른팔 사각형의 위치를 매 프레임마다 업데이트
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

      if (!isGameStarted) {
        socketRef.current.on("body-coords-L", handleLeftsideBodyCoords);
        socketRef.current.on("body-coords-R", handleRightsideBodyCoords);
      } else {
        socketRef.current.off("body-coords-L", handleLeftsideBodyCoords);
        socketRef.current.off("body-coords-R", handleRightsideBodyCoords);

        const fixedRef1 = {
          x: leftArmLeftRef.current.position.x,
          y: leftArmLeftRef.current.position.y,
          width: leftArmLeftRef.current.vertices[1].x - leftArmLeftRef.current.vertices[0].x,
          height: leftArmLeftRef.current.vertices[1].y - leftArmLeftRef.current.vertices[0].y,
          angle: leftArmLeftRef.current.angle
        };
        const fixedRef2 = {
          x: rightHand1RightRef.current.position.x,
          y: rightHand1RightRef.current.position.y,
          width: rightHand1RightRef.current.vertices[1].x - rightHand1RightRef.current.vertices[0].x,
          height: rightHand1RightRef.current.vertices[1].y - rightHand1RightRef.current.vertices[0].y,
          angle: rightHand1RightRef.current.angle
        };
        const fixedRef3 = {
          x: rightHand2RightRef.current.position.x,
          y: rightHand2RightRef.current.position.y,
          width: rightHand2RightRef.current.vertices[1].x - rightHand2RightRef.current.vertices[0].x,
          height: rightHand2RightRef.current.vertices[1].y - rightHand2RightRef.current.vertices[0].y,
          angle: rightHand2RightRef.current.angle
        };
  
        fetch("/simulation-start", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fixedRef1,
            fixedRef2,
            fixedRef3
          })
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error sending simulation start:', error));
      }

      return () => {
        socketRef.current.off("body-coords-L", handleLeftsideBodyCoords);
        socketRef.current.off("body-coords-R", handleRightsideBodyCoords);
      };
  }, [isGameStarted]);

  // 게임 시작 시 원에 연속적인 힘을 가함
  useEffect(() => {
    const applyContinuousForce = () => {
      Body.applyForce(mouseRef.current, mouseRef.current.position, {
        x: 0.01,
        y: 0,
      });
      Body.setAngularVelocity(mouseRef.current, 0);
    };

    if (isGameStarted) {
      // 왼팔 및 오른팔 충돌 ON
      leftArmLeftRef.current.collisionFilter.mask = 0xffff;
      rightHand1RightRef.current.collisionFilter.mask = 0xffff;
      rightHand2RightRef.current.collisionFilter.mask = 0xffff;

      // 원을 움직이기 위해 static 해제
      Body.setStatic(mouseRef.current, false);
      Body.setStatic(bombRef.current, false);
      Events.on(engineRef.current, "beforeUpdate", applyContinuousForce);
    }

    return () => {
      Events.off(engineRef.current, "beforeUpdate", applyContinuousForce);
    };
  }, [isGameStarted]);
  // =============== 게임 시작 이벤트 ===============

  useEffect(() => {
    if (isIngameStarted && countdown > 0) {
      const interval = setInterval(() => {
        setCountdown((prevCount) => prevCount - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (countdown === 0) {
      setIsGameStarted(true);
      setCountdown(null);
    }
  }, [isIngameStarted, countdown]);

  const startGame = () => {
    setIsGoalReached(false);
    setCountdown(3);
    setIsIngameStarted(true);
  };

  return (
    <div className="App">
      <div id="matter-container" ref={sceneRef}></div>
      <div id="video-container-1">
        <img
          ref={videoRef}
          src="/leftside-video-feed"
          alt="Leftside Video Feed"
          onLoad={() => setIsLeftCamLoaded(true)}
          onError={() => alert('Failed to load video feed.')}
        />
      </div>
      <div id="video-container-2">
        <img
          ref={videoRef}
          src="/rightside-video-feed"
          alt="Rightside Video Feed"
          onLoad={() => setIsRightCamLoaded(true)}
          onError={() => alert('Failed to load video feed.')}
        />
      </div>
      {isIngameStarted && countdown > 0 && <div id="countdown">{countdown}</div>}
      {/* 주석 처리한 부분은 멀티 구현되었을 때 풀 것. */}
      {!isIngameStarted && isLeftCamLoaded && isRightCamLoaded && (
        <button onClick={startGame} id="start-button">Start Game</button>
      )}
      {!isLeftCamLoaded && !isRightCamLoaded && <div id="loading-overlay">Loading...</div>}
    </div>
  );
}

export default Game2;