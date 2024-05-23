// react-frontend-ts/src/components/Game.tsx
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import {
  useStage1Setup,
  useStage2Setup,
  useStage3Setup,
  useStage4Setup,
  // useStage5Setup,
} from "../hooks/useStageSetup";
import {
  useStage1Start,
  useStage2Start,
  useStage3Start,
  useStage4Start,
  useStage5Start,
} from "../hooks/useStageStart";
import useAudio from "../hooks/useAudio";
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
import "../styles/game.css";
import Video from "./Video";

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
  const canvasSize = { x: 2400, y: 900 };

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
  const [simStartTime, setSimStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showRetryRequest, setShowRetryRequest] = useState(false);
  const [showWaitingPopup, setShowWaitingPopup] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [placeholder, setPlaceholder] = useState("");
  const textareaRef = useRef(null); // textarea 요소에 대한 참조 생성

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mouseEndPos, setMouseEndPos] = useState({ x: 0, y: 0 });

  //--------------play sound---------------
  const { play, pause, changeSource, setLoop, setVolume } = useAudio({
    initialSrc: "/music/stage_BGM_squeakSystem.mp3",
  });

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(event.target.value));
  };

  // 볼륨 조절 함수
  const VoiceSetVolume = (volume: number) => {
    if (userVideo.current) {
      userVideo.current.volume = volume;
    }
  };

  useEffect(() => {
    setLoop(true);
    play();
    setVolume(0.1);
  }, [play, setLoop]);

  useEffect(() => {
    if (resultState !== null && resultState !== 0) {
      pause();
    }
  }, [resultState, pause]);

  const stretchAudioRef = useRef<HTMLAudioElement | null>(null);
  const releaseAudioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    // 오디오 파일 로드
    stretchAudioRef.current = new Audio("/sound/band_stretch.wav");
    releaseAudioRef.current = new Audio("/sound/band_release.wav");
  }, []);
  //--------------play sound---------------
  //--------------get coordinates---------------
  const handleMouseDown = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const canvas = event.target as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    setIsMouseDown(true);
    setIsMouseUP(false);
    if (stretchAudioRef.current && isTutorialImage2End && !isSimStarted) {
      stretchAudioRef.current.play();
    }

    setMousePos({ x: mouseX, y: mouseY });
  };

  const handleMouseMove = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (isMouseDown && !isMouseUP) {
      const canvas = event.target as HTMLCanvasElement;
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      setMouseEndPos({ x: mouseX, y: mouseY });
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setIsMouseUP(true);
    if (releaseAudioRef.current && isTutorialImage2End && !isSimStarted) {
      releaseAudioRef.current.play();
    }
  };
  //--------------get coordinates----------------

  // ---------- 게임 시뮬레이션 시간 기록 ----------
  useEffect(() => {
    if (isSimStarted) {
      setSimStartTime(Date.now());
    } else {
      setSimStartTime(null);
    }
  }, [isSimStarted]);

  useEffect(() => {
    if (resultState === 0 && simStartTime) {
      setElapsedTime((Date.now() - simStartTime) / 1000);
    }
  }, [resultState]);
  // ---------- 게임 시뮬레이션 시간 기록 ----------

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
    // useStage5Setup,
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

  const { mouseRef, bombRef, leftArmLeftRef, rightArmRightRef, engineRef } =
    stageSetups[currentStage - 1](
      { x: 1600, y: 600 },
      sceneRef,
      isSimStarted,
      isTutorialImage2End,
      setResultState
    );

  const {
    userVideo,
    peers,
    indexRef,
    sendLeftHandJoint,
    sendRightHandJoint,
    isSpeaking,
    isPeerSpeaking,
  } = useWebRTC(
    nestjsSocketRef,
    flaskSocketRef,
    gameRoomID,
    leftArmLeftRef,
    rightArmRightRef,
    { x: 1600, y: 600 },
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
    joint1Start: { x: typeof startCx; y: typeof startCy };
    joint1End: { x: typeof endCx; y: typeof endCy };
  }

  interface BodyCoordsR {
    joint1Start: { x: typeof startCx; y: typeof startCy };
    joint1End: { x: typeof endCx; y: typeof endCy };
  }
  useEffect(() => {
    //-------------좌표넘겨주는 코드----------------
    const handleLeftsideBodyCoords = (data: BodyCoordsL) => {
      const { joint1Start, joint1End } = data;
      if (
        joint1Start &&
        joint1End &&
        joint1Start.x <= canvasSize.x / 2 &&
        joint1End.x <= canvasSize.x / 2
      ) {
        updateSkeleton(leftArmLeftRef, joint1Start, joint1End);
        sendLeftHandJoint(joint1Start, joint1End);
      }
    };

    const handleRightsideBodyCoords = (data: BodyCoordsR) => {
      const { joint1Start, joint1End } = data;
      if (
        joint1Start &&
        joint1End &&
        joint1Start.x >= canvasSize.x / 2 &&
        joint1End.x >= canvasSize.x / 2
      ) {
        updateSkeleton(rightArmRightRef, joint1Start, joint1End);
        sendRightHandJoint(joint1Start, joint1End);
      }
    };

    if (isTutorialImage2End && !isSimStarted && indexRef.current === 0) {
      handleLeftsideBodyCoords({
        joint1Start: mousePos,
        joint1End: mouseEndPos,
      });
    }
    if (isTutorialImage2End && !isSimStarted && indexRef.current === 1) {
      handleRightsideBodyCoords({
        joint1Start: mousePos,
        joint1End: mouseEndPos,
      });
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
    setShowWaitingPopup(true);
    if (nestjsSocketRef.current) {
      nestjsSocketRef.current.emit("retry-request", { roomName: gameRoomID });
    }
  };

  const handleStart = () => {
    if (nestjsSocketRef.current) {
      nestjsSocketRef.current.emit("start-request", { roomName: gameRoomID });
    }
  };

  const handleAcceptRetry = () => {
    setShowRetryRequest(false);
    setShowWaitingPopup(false);
    if (nestjsSocketRef.current) {
      nestjsSocketRef.current.emit("retry-response", {
        roomName: gameRoomID,
        accepted: true,
      });
    }
  };

  const handleRejectRetry = () => {
    setShowRetryRequest(false);
    setShowWaitingPopup(false);
    if (nestjsSocketRef.current) {
      nestjsSocketRef.current.emit("retry-response", {
        roomName: gameRoomID,
        accepted: false,
      });
    }
  };

  // 클라이언트 측에서 reset-retry 요청 핸들링
  useEffect(() => {
    if (nestjsSocketRef.current) {
      nestjsSocketRef.current.on("start-response", () => {
        console.log("start-response received");
        setCountdown(1);
      });

      nestjsSocketRef.current.on("retry-request", () => {
        setShowRetryRequest(true);
      });

      nestjsSocketRef.current.on("retry-response", (accepted: boolean) => {
        setShowRetryRequest(false);
        setShowWaitingPopup(false);
        if (accepted) {
          clearStageObjects[currentStage - 1](
            { x: 1600, y: 600 },
            { mouseRef, bombRef, leftArmLeftRef, rightArmRightRef },
            setIsTutorialImage1End,
            setIsTutorialImage2End,
            setIsSimStarted,
            setShowModal,
            setResultState,
            setCountdown
          );
          play();
        }
      });
    }
  }, []);

  // 다음 스테이지 버튼 클릭 시 처리 로직
  const handleNextStage = () => {
    setIsMenuOpen(false);
    resetStageObjects[currentStage - 1](
      { x: 1600, y: 600 },
      { mouseRef, bombRef, leftArmLeftRef, rightArmRightRef, engineRef },
      setIsGameStarted,
      setIsSimStarted,
      setIsTutorialImage1End,
      setIsTutorialImage2End,
      setShowModal,
      setResultState,
      setCountdown,
      setIsPlayerReady
    );
    setCurrentStage((prevStage) => Math.min(prevStage + 1, 4)); // 최대 4스테이지
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

  useEffect(() => {
    // 현재 url 링크 창
    setPlaceholder("https://zzrot.store" + window.location.pathname);
  }, []);

  const handleCopyClick = () => {
    if (textareaRef.current) {
      textareaRef.current.select(); // textarea 전체 선택
      document.execCommand("copy"); // 클립보드로 복사
      // 필요하다면 복사 완료 알림 등 추가 로직 작성
    }
  };
  const handleOpenModal = () => {
    setIsModalOpen(true);
    console.log("modal open");
  };
  const handleCloseModal = () => setIsModalOpen(false);
  return (
    <>
      <div className="animated-background"></div>

      <div className="App">
        <div className="header-ingame">
          <button className="menu-button" onClick={() => setIsMenuOpen(true)}>
            메뉴
          </button>
          {/* <img src="/images/Rattus.webp" className="logo"></img> */}
          <button className="if" onClick={handleOpenModal}>
            친구초대
          </button>
        </div>

        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={handleCloseModal}>
                &times;
              </span>
              <p>친구 초대 링크:</p>
              <textarea readOnly value={placeholder} />
              <button onClick={handleCopyClick}>Copy URL</button>
            </div>
          </div>
        )}

        <div id="matter-container" ref={sceneRef}>
          {peers
            .slice(indexRef.current)
            .map(
              (peer, index) =>
                isTutorialImage2End &&
                !isSimStarted && (
                  <div
                    id={
                      indexRef.current === 0
                        ? "video-container-1"
                        : "video-container-2"
                    }
                    key={index}
                  ></div>
                )
            )}
          {isTutorialImage2End && !isSimStarted && (
            <div
              id={
                indexRef.current === 0
                  ? "video-container-1"
                  : "video-container-2"
              }
              style={{ border: "20px solid floralwhite" }}
            ></div>
          )}
          {peers
            .slice(indexRef.current)
            .map(
              (peer, index) =>
                isTutorialImage2End &&
                !isSimStarted && (
                  <div
                    id={
                      indexRef.current === 0
                        ? "video-container-1"
                        : "video-container-2"
                    }
                    key={index}
                  ></div>
                )
            )}

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
          {peers.slice(indexRef.current).map((peer, index) => (
            <Video
              key={`${peer.peerID}-${index}`}
              peer={peer.peer}
              peers={peers}
              myIndexRef={0}
            />
          ))}

          <canvas
            ref={canvasRef}
            className="canvas-transparent"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          />
        </div>

        {isGameStarted &&
          !isTutorialImage1End &&
          countdown &&
          countdown > 0 && (
            <div id="tutorial-image-1">
              <div className="background"></div>
              <div className="text">준비하시고..</div>
            </div>
          )}

        {isTutorialImage1End &&
          !isTutorialImage2End &&
          countdown &&
          countdown > 0 && (
            <div id="tutorial-image-2">
              <div className="background"></div>
              <div className="text">출발!</div>
            </div>
          )}

        {/* 작전 타임 */}
        {/* {isTutorialImage2End && countdown && countdown > 0 && (
          <div id="countdown-container">
            <div id="countdown-bar">
              <div id="countdown-stripes"></div>
            </div>
          </div>
        )} */}
        {isTutorialImage2End && countdown && countdown > 0 && (
          <div id="loading-text">드래그로 지형을 설치해주세요: {countdown}</div>
        )}

        {!isPlayerReady &&
          document.getElementById("player" + indexRef)?.textContent !=
            "WAITING" && (
            <button onClick={readyGame} id="ready-button">
              READY
            </button>
          )}

        {isTutorialImage2End && !isSimStarted && (
          <button onClick={handleStart} id="start-button">
            바로시작
          </button>
        )}

        {isMenuOpen && (
          <div className="menu-popup">
            <button onClick={handleRetry}>RE-TRY</button>
            <button onClick={() => setIsMenuOpen(false)}>닫기</button>
            <label>
              Volume:
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                defaultValue="0.1"
                onChange={handleVolumeChange}
              />
            </label>
            <label>
              Voice:
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                onChange={(e) => VoiceSetVolume(+e.target.value)}
                defaultValue="0.5"
              />
            </label>
          </div>
        )}
        <footer className="footer">
          {indexRef.current === 0 && (
            <div>
              <span id="player0" className={isSpeaking ? "speaking" : ""}>
                WAITING
              </span>
              <span id="player1" className={isPeerSpeaking ? "speaking" : ""}>
                WAITING
              </span>
            </div>
          )}
          {indexRef.current === 1 && (
            <div>
              <span id="player1" className={isSpeaking ? "speaking" : ""}>
                WAITING
              </span>
              <span id="player0" className={isPeerSpeaking ? "speaking" : ""}>
                WAITING
              </span>
            </div>
          )}
        </footer>

        {showRetryRequest && (
          <div className="retry-popup">
            <h1>상대방이 다시 시도하려고 합니다. 수락하시겠습니까?</h1>
            <button onClick={handleAcceptRetry}>수락</button>
            <button onClick={handleRejectRetry}>거절</button>
          </div>
        )}

        {showWaitingPopup && (
          <div className="waiting-popup">
            <h1>
              <span></span>
            </h1>
          </div>
        )}

        {showModal && (
          <div className="modal">
            {resultState === 0 && (
              <div>
                <h1>YOU WON!</h1>
                <h2>현재 스테이지: {currentStage} </h2>
                {elapsedTime !== null && (
                  <h2>걸린 시간: {elapsedTime.toFixed(2)}초</h2>
                )}
                {/* <h1> 치즈를 찾았습니다! </h1> */}
                {/* <img src="/images/resultState_clear.png" alt="Victory" /> */}
                {/* <button onClick={handleRetry}>다시하기</button> */}
                <button onClick={handleNextStage}>NEXT STAGE</button>
              </div>
            )}
            {resultState === 1 && (
              <div>
                <h1>GAME OVER!</h1>
                {/* <h1> 시간이 초과되었습니다! </h1> */}
                {/* <img src="/images/resultState_timeout.png" alt="Timeout" /> */}
                <button onClick={handleRetry}>RE-TRY</button>
                {/* <button onClick={handleNextStage}>다음스테이지</button> */}
              </div>
            )}
            {resultState === 2 && (
              <div>
                <h1>GAME OVER!</h1>
                {/* <h1> 노릇하게 구워졌습니다 </h1> */}
                {/* <img src="/images/resultState_bomb.png" alt="Bomb" /> */}
                <button onClick={handleRetry}>RE-TRY</button>
                {/* <button onClick={handleNextStage}>다음스테이지</button> */}
              </div>
            )}
            {resultState === 3 && (
              <div>
                <h1>GAME OVER!</h1>
                {/* <h1> 폭탄에 닿았습니다! </h1> */}
                {/* <img src="/images/resultState_bomb.png" alt="Bomb" /> */}
                <button onClick={handleRetry}>RE-TRY</button>
                {/* <button onClick={handleNextStage}>다음스테이지</button> */}
              </div>
            )}
            {resultState === 4 && (
              <div>
                <h1>GAME OVER!</h1>
                {/* <h1> 고양이에게 잡혔습니다! </h1> */}
                {/* <img src="/images/resultState_bomb.png" alt="Bomb" /> */}
                <button onClick={handleRetry}>RE-TRY</button>
                {/* <button onClick={handleNextStage}>다음스테이지</button> */}
              </div>
            )}
            {resultState === 5 && (
              <div>
                <h1>GAME OVER!</h1>
                {/* <h1> 바닥에 떨어졌습니다! </h1> */}
                {/* <img src="/images/resultState_bomb.png" alt="Bomb" /> */}
                <button onClick={handleRetry}>RE-TRY</button>
                {/* <button onClick={handleNextStage}>다음스테이지</button> */}
              </div>
            )}
            {resultState === 7 && (
              <div>
                <h1>GAME COMPLETE!</h1>
                <h2>현재 스테이지: {currentStage} </h2>
                {elapsedTime !== null && (
                  <h2>걸린 시간: {elapsedTime.toFixed(2)}초</h2>
                )}
                {/* <h1> 치즈를 찾았습니다! </h1> */}
                {/* <img src="/images/resultState_clear.png" alt="Victory" /> */}
                {/* <button onClick={handleRetry}>다시하기</button> */}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Game;
