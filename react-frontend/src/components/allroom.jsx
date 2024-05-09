// allroom.jsx
import React, { useEffect, useRef, useState } from "react";
import { Engine, Body } from "matter-js";
import io from "socket.io-client";
import useMatterSetup from "../hooks/useMatterSetup";
import useWebRTC from "../hooks/useWebRTC";
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
          startCapturing(stream, props.ref, props.canvasRef);
      });

      return () => {
          peer.removeAllListeners("stream");
      };
  }, [props.peer]);

  return (
      <video autoPlay playsInline ref={ref} />
  );
}

const startCapturing = (stream, ref, canvasRef) => {
  const video = ref.current;
  const canvas = canvasRef.current;

  // 캔버스가 없다면 함수 종료
  if (!canvas) return;

  const context = canvas.getContext('2d');

  // 캔버스 크기를 비디오와 동일하게 설정
  const resizeCanvas = () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  };

  // 비디오의 메타데이터가 로드되면 캔버스 크기 조정
  video.onloadedmetadata = resizeCanvas;

  // 윈도우 크기가 변경될 때 캔버스 크기 재설정
  window.addEventListener('resize', resizeCanvas);

  // 이미지를 주기적으로 캡처하고 WebSocket을 통해 전송
  const interval = setInterval(() => {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // 캔버스에서 이미지를 Base64 문자열로 추출
      const imageData = canvas.toDataURL('image/jpeg');

      // 이미지 데이터를 서버로 전송
      socketRef.current.emit('image-capture-R', { image: imageData });
    }
  }, 100); // 100ms마다 이미지 캡처 (이 값을 조정하여 전송 주기 변경 가능)

  return () => {
    clearInterval(interval);
    window.removeEventListener('resize', resizeCanvas);
  };
};

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
    nestjsSocketRef.current = io("http://43.203.29.69");
  }, []);

  const { userVideo, peers, myIndexRef } = useWebRTC(flaskSocketRef, "game2");
  // game2 part

  const [showModal, setShowModal] = useState(true);
  const [isSimStarted, setIsSimStarted] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGoalReached, setIsGoalReached] = useState(false);
  const [countdown, setCountdown] = useState(3);

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
        peers.slice(0, myIndexRef.current).map((peer, index) => (
          <Video id={myIndexRef.current === 0 ? 'video-container-2' : 'video-container-1'} key={`${peer.peerID}-${index}`} peer={peer.peer} canvasRef={canvasRef}/>
      ))}
      {
        <video id={myIndexRef.current === 0 ? 'video-container-1' : 'video-container-2'} muted ref={userVideo} autoPlay playsInline style={{ order: myIndexRef.current }} />

      }
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      {
        peers.slice(myIndexRef.current).map((peer, index) => (
          <Video id={myIndexRef.current === 0 ? 'video-container-2' : null} key={`${peer.peerID}-${index}`} peer={peer.peer} canvasRef={canvasRef}/>
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