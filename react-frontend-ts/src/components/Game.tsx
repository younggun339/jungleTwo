// Game.tsx
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import {
  useStage1Setup,
  useStage2Setup,
  useStage3Setup,
  useStage4Setup,
  useStage5Setup,
} from "../hooks/useStageSetup";
import {
  useStage1Start,
  useStage2Start,
  useStage3Start,
  useStage4Start,
  useStage5Start,
} from "../hooks/useStageStart";
import {
  resetStage1Objects,
  resetStage2Objects,
  resetStage3Objects,
  resetStage4Objects,
  resetStage5Objects,
} from "../utils/resetStageObjects";
import {
  clearStage1Objects,
  clearStage2Objects,
  clearStage3Objects,
  clearStage4Objects,
  clearStage5Objects,
} from "../utils/clearStageObjects";
import useWebRTC, { WebRTCResult } from "../hooks/useWebRTC";
import { updateSkeleton } from "../utils/updateSkeleton";
import Video from "./Video";
import "../styles/game.css";

interface GameProps {
  userName: string;
}

export interface CanvasSize {
  x: number;
  y: number;
}

const Game: React.FC<GameProps> = ({ userName }) => {
  const { gameRoomID } = useParams<{ gameRoomID: string | undefined }>();
  if (!gameRoomID) {
    throw new Error("gameRoomID is required but was not provided");
  }
  const canvasSize = { x: 1600, y: 600 };

  const nestjsSocketRef = useRef<Socket | null>(null);
  const flaskSocketRef = useRef<Socket | null>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isMouseUP, setIsMouseUP] = useState(true);
  const [isMouseDown, setIsMouseDown] = useState(false);

  const [countdown, setCountdown] = useState<number | null>(null);
  const [currentStage, setCurrentStage] = useState<number>(1);

  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isTutorialImage1End, setIsTutorialImage1End] = useState(false);
  const [isTutorialImage2End, setIsTutorialImage2End] = useState(false);
  const [isSimStarted, setIsSimStarted] = useState(false);
  const [resultState, setResultState] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  //--------------get coordinates---------------
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mouseEndPos, setMouseEndPos] = useState({ x: 0, y: 0 });
  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const canvas = event.target as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    setIsMouseDown(true);
    setIsMouseUP(false);
  
    setMousePos({ x: mouseX, y: mouseY });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (isMouseDown && !isMouseUP) {
      const canvas = event.target as HTMLCanvasElement;
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      
      setMouseEndPos({ x: mouseX, y: mouseY });
    }
  }
  
  // 인게임 및 통신 관련 소켓
  useEffect(() => {
    nestjsSocketRef.current = io("https://zzrot.store/", {
      path: "/nestSocket",
    });

    nestjsSocketRef.current.on("connect", () => {
      nestjsSocketRef.current?.emit("user-signal", { gameRoomID, userName });
    });
  }, []);

  const stageSetups = [
    useStage1Setup,
    useStage2Setup,
    useStage3Setup,
    useStage4Setup,
    useStage5Setup,
  ];

  const stageStarts = [
    useStage1Start,
    useStage2Start,
    useStage3Start,
    useStage4Start,
    useStage5Start,
  ];

  const resetStageObjects = [
    resetStage1Objects,
    resetStage2Objects,
    resetStage3Objects,
    resetStage4Objects,
    resetStage5Objects,
  ];

  const clearStageObjects = [
    clearStage1Objects,
    clearStage2Objects,
    clearStage3Objects,
    clearStage4Objects,
    clearStage5Objects,
  ];

  const { mouseRef, bombRef, leftArmLeftRef, rightArmRightRef } = stageSetups[currentStage - 1](
    canvasSize, sceneRef, isSimStarted, isTutorialImage2End, setResultState
    );

  const { userVideo, peers, indexRef, sendLeftHandJoint, sendRightHandJoint } =
    useWebRTC(
      nestjsSocketRef,
      flaskSocketRef,
      gameRoomID,
      leftArmLeftRef,
      rightArmRightRef,
      canvasSize,
      canvasRef,
      userName,
      isTutorialImage2End,
      isSimStarted
  ) as WebRTCResult;

  let startCx = mousePos.x;
  let startCy = mousePos.y;
  let endCx = mouseEndPos.x;
  let endCy = mouseEndPos.y;

  interface BodyCoordsL {
    joint1Start: {x: typeof startCx, y :typeof startCy};
    joint1End: {x: typeof endCx, y :typeof endCy};
  }

  interface BodyCoordsR {
    joint1Start: {x: typeof startCx, y :typeof startCy};
    joint1End: {x: typeof endCx, y :typeof endCy};
  }

  useEffect(() => {
    //-------------좌표넘겨주는 코드----------------
    const handleLeftsideBodyCoords = (data: BodyCoordsL) => {
      const { joint1Start, joint1End } = data;
      if (joint1Start && joint1End && joint1Start.x <= canvasSize.x / 2 && joint1End.x <= canvasSize.x / 2) {
        updateSkeleton(leftArmLeftRef, joint1Start, joint1End);
        sendLeftHandJoint(joint1Start, joint1End);
      }
    };

    const handleRightsideBodyCoords = (data: BodyCoordsR) => {
      const { joint1Start, joint1End } = data;
      if (joint1Start && joint1End && joint1Start.x >= canvasSize.x / 2 && joint1End.x >= canvasSize.x / 2) {
        updateSkeleton(rightArmRightRef, joint1Start, joint1End);
        sendRightHandJoint(joint1Start, joint1End);
      }
    };
    
    if (indexRef.current === 0) {
      handleLeftsideBodyCoords({joint1Start: mousePos, joint1End: mouseEndPos});
    }
    if (indexRef.current === 1) {
      handleRightsideBodyCoords({joint1Start: mousePos, joint1End: mouseEndPos});
    }
  }, [isTutorialImage2End, indexRef.current, mouseEndPos.y]);

  // =============== 게임 시작 이벤트 ===============
  const { readyGame } = stageStarts[currentStage - 1](
    nestjsSocketRef,
    gameRoomID,
    userName,
    isGameStarted,
    isTutorialImage1End,
    isTutorialImage2End,
    isSimStarted,
    countdown,
    resultState,
    setIsPlayerReady,
    setIsGameStarted,
    setIsTutorialImage1End,
    setIsTutorialImage2End,
    setIsSimStarted,
    setCountdown,
    setResultState
  );

  // ============== 게임 결과 모달 =====================
  const handleRetry = () => {
    setIsMenuOpen(false);
    clearStageObjects[currentStage - 1](
      { mouseRef, bombRef, leftArmLeftRef, rightArmRightRef },
      setIsSimStarted,
      setShowModal,
      setResultState,
      setCountdown,
    );
  };

  // 다음 스테이지 버튼 클릭 시 처리 로직
  const handleNextStage = () => {
    resetStageObjects[currentStage - 1](
      { mouseRef, bombRef, leftArmLeftRef, rightArmRightRef },
      setIsGameStarted,
      setIsSimStarted,
      setIsTutorialImage1End,
      setIsTutorialImage2End,
      setShowModal,
      setResultState,
      setCountdown,
      setIsPlayerReady
    );
    setCurrentStage((prevStage) => Math.min(prevStage + 1, 5)); // 최대 5스테이지
    setShowModal(false);

    if (nestjsSocketRef.current) {
      nestjsSocketRef.current.emit("reset-ready", { roomName: gameRoomID });
    }
  };

  useEffect(() => {
    if (resultState !== null) {
      setShowModal(true);
    }
  }, [resultState]);

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
        />
        <canvas
          ref={canvasRef}
          className="canvas-transparent"
          // handleMouseDown 및 setIsMouseDown 함수 추가 
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={() => { setIsMouseDown(false); setIsMouseUP(true); }}
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

      {isGameStarted && !isTutorialImage1End && countdown && countdown > 0 && (
        <div id="tutorial-image-1">
          <img src="/images/tutorialImage_001.png" alt="tutorial1" />
        </div>
      )}

      {isTutorialImage1End &&
        !isTutorialImage2End &&
        countdown &&
        countdown > 0 && (
          <div id="tutorial-image-2">
            <img src="/images/tutorialImage_002.png" alt="tutorial2" />
          </div>
        )}

      {/* 작전 타임 && 제한 시간 */}
      {isTutorialImage2End && countdown && countdown > 0 && (
        <div id="countdown">{countdown}</div>
      )}

      {!isPlayerReady && (
        <button onClick={readyGame} id="ready-button">
          준비 완료
        </button>
      )}

      <button className="menu-button" onClick={() => setIsMenuOpen(true)}>
        메뉴
      </button>

      {isMenuOpen && (
        <div className="menu-popup">
          <button onClick={handleRetry}>다시하기</button>
          <button onClick={() => setIsMenuOpen(false)}>닫기</button>
        </div>
      )}

      <footer className="footer">
        <div id="player0">기다리는 중...</div>
        <div id="player1">기다리는 중...</div>
      </footer>

      {showModal && (
        <div className="modal">
          {resultState === 0 && (
            <div>
              <h1> 치즈를 찾았습니다! </h1>
              <img src="/images/resultState_clear.png" alt="Victory" />
              <button onClick={handleRetry}>다시하기</button>
              <button onClick={handleNextStage}>다음스테이지</button>
            </div>
          )}
          {resultState === 1 && (
            <div>
              <h1> 시간이 초과되었습니다! </h1>
              <img src="/images/resultState_timeout.png" alt="Timeout" />
              <button onClick={handleRetry}>다시하기</button>
              <button onClick={handleNextStage}>다음스테이지</button>
            </div>
          )}
          {resultState === 2 && (
            <div>
              <h1> 아뜨뜨뜨뜨! </h1>
              <img src="/images/resultState_spiketrap.png" alt="Trap" />
              <button onClick={handleRetry}>다시하기</button>
              <button onClick={handleNextStage}>다음스테이지</button>
            </div>
          )}
          {resultState === 3 && (
            <div>
              <h1> 폭탄에 닿았습니다! </h1>
              <img src="/images/resultState_bomb.png" alt="Bomb" />
              <button onClick={handleRetry}>다시하기</button>
              <button onClick={handleNextStage}>다음스테이지</button>
            </div>
          )}
          {resultState === 4 && (
            <div>
              <h1> 고양이에게 잡혔습니다! </h1>
              <img src="/images/resultState_bomb.png" alt="Bomb" />
              <button onClick={handleRetry}>다시하기</button>
              <button onClick={handleNextStage}>다음스테이지</button>
            </div>
          )}
          {resultState === 5 && (
            <div>
              <h1> 바닥에 떨어졌습니다! </h1>
              <img src="/images/resultState_bomb.png" alt="Bomb" />
              <button onClick={handleRetry}>다시하기</button>
              <button onClick={handleNextStage}>다음스테이지</button>
            </div>
          )}
          {/* 데드씬 추가 예정 */}
        </div>
      )}
    </div>
  );
};

export default Game;
