// src/hooks/useStageStart.ts
import { useEffect } from "react";
import { Socket } from "socket.io-client";

// ================================================ STAGE 1 ====================================================
export const useStage1Start = (
  nestjsSocketRef: React.MutableRefObject<Socket | null>,
  gameRoomID: string,
  userName: string,
  isGameStarted: boolean,
  isTutorialImage1End: boolean,
  isTutorialImage2End: boolean,
  isSimStarted: boolean,
  countdown: number | null,
  timeLimit: number | null,
  resultState: number | null,
  setIsPlayerReady: (value: boolean) => void,
  setIsGameStarted: (value: boolean) => void,
  setIsTutorialImage1End: (value: boolean) => void,
  setIsTutorialImage2End: (value: boolean) => void,
  setIsSimStarted: (value: boolean) => void,
  setCountdown: (value: number | null) => void,
  setTimeLimit: (value: number | null) => void,
  setResultState: (value: number | null) => void,
) => {

  return useStageStart(
    nestjsSocketRef,
    gameRoomID,
    userName,
    isGameStarted,
    isTutorialImage1End,
    isTutorialImage2End,
    isSimStarted,
    countdown,
    timeLimit,
    5,  // firstImageTime
    5,  // secondImageTime
    15, // chatTime
    10, // simTime
    resultState,
    setIsPlayerReady,
    setIsGameStarted,
    setIsTutorialImage1End,
    setIsTutorialImage2End,
    setIsSimStarted,
    setCountdown,
    setTimeLimit,
    setResultState
  );
};

// ================================================ STAGE 2 ====================================================
export const useStage2Start = (
  nestjsSocketRef: React.MutableRefObject<Socket | null>,
  gameRoomID: string,
  userName: string,
  isGameStarted: boolean,
  isTutorialImage1End: boolean,
  isTutorialImage2End: boolean,
  isSimStarted: boolean,
  countdown: number | null,
  timeLimit: number | null,
  resultState: number | null,
  setIsPlayerReady: (value: boolean) => void,
  setIsGameStarted: (value: boolean) => void,
  setIsTutorialImage1End: (value: boolean) => void,
  setIsTutorialImage2End: (value: boolean) => void,
  setIsSimStarted: (value: boolean) => void,
  setCountdown: (value: number | null) => void,
  setTimeLimit: (value: number | null) => void,
  setResultState: (value: number | null) => void,
) => {

  return useStageStart(
    nestjsSocketRef,
    gameRoomID,
    userName,
    isGameStarted,
    isTutorialImage1End,
    isTutorialImage2End,
    isSimStarted,
    countdown,
    timeLimit,
    5,  // firstImageTime
    5,  // secondImageTime
    20, // chatTime
    12, // simTime
    resultState,
    setIsPlayerReady,
    setIsGameStarted,
    setIsTutorialImage1End,
    setIsTutorialImage2End,
    setIsSimStarted,
    setCountdown,
    setTimeLimit,
    setResultState
  );
};

// ================================================ STAGE 3 ====================================================
export const useStage3Start = (
  nestjsSocketRef: React.MutableRefObject<Socket | null>,
  gameRoomID: string,
  userName: string,
  isGameStarted: boolean,
  isTutorialImage1End: boolean,
  isTutorialImage2End: boolean,
  isSimStarted: boolean,
  countdown: number | null,
  timeLimit: number | null,
  resultState: number | null,
  setIsPlayerReady: (value: boolean) => void,
  setIsGameStarted: (value: boolean) => void,
  setIsTutorialImage1End: (value: boolean) => void,
  setIsTutorialImage2End: (value: boolean) => void,
  setIsSimStarted: (value: boolean) => void,
  setCountdown: (value: number | null) => void,
  setTimeLimit: (value: number | null) => void,
  setResultState: (value: number | null) => void,
) => {

  return useStageStart(
    nestjsSocketRef,
    gameRoomID,
    userName,
    isGameStarted,
    isTutorialImage1End,
    isTutorialImage2End,
    isSimStarted,
    countdown,
    timeLimit,
    5,  // firstImageTime
    5,  // secondImageTime
    25, // chatTime
    15, // simTime
    resultState,
    setIsPlayerReady,
    setIsGameStarted,
    setIsTutorialImage1End,
    setIsTutorialImage2End,
    setIsSimStarted,
    setCountdown,
    setTimeLimit,
    setResultState
  );
};

// ================================================ STAGE 4 ====================================================
export const useStage4Start = (
  nestjsSocketRef: React.MutableRefObject<Socket | null>,
  gameRoomID: string,
  userName: string,
  isGameStarted: boolean,
  isTutorialImage1End: boolean,
  isTutorialImage2End: boolean,
  isSimStarted: boolean,
  countdown: number | null,
  timeLimit: number | null,
  resultState: number | null,
  setIsPlayerReady: (value: boolean) => void,
  setIsGameStarted: (value: boolean) => void,
  setIsTutorialImage1End: (value: boolean) => void,
  setIsTutorialImage2End: (value: boolean) => void,
  setIsSimStarted: (value: boolean) => void,
  setCountdown: (value: number | null) => void,
  setTimeLimit: (value: number | null) => void,
  setResultState: (value: number | null) => void,
) => {

  return useStageStart(
    nestjsSocketRef,
    gameRoomID,
    userName,
    isGameStarted,
    isTutorialImage1End,
    isTutorialImage2End,
    isSimStarted,
    countdown,
    timeLimit,
    5,  // firstImageTime
    5,  // secondImageTime
    30, // chatTime
    20, // simTime
    resultState,
    setIsPlayerReady,
    setIsGameStarted,
    setIsTutorialImage1End,
    setIsTutorialImage2End,
    setIsSimStarted,
    setCountdown,
    setTimeLimit,
    setResultState
  );
};

// ================================================ STAGE 5 ====================================================
export const useStage5Start = (
  nestjsSocketRef: React.MutableRefObject<Socket | null>,
  gameRoomID: string,
  userName: string,
  isGameStarted: boolean,
  isTutorialImage1End: boolean,
  isTutorialImage2End: boolean,
  isSimStarted: boolean,
  countdown: number | null,
  timeLimit: number | null,
  resultState: number | null,
  setIsPlayerReady: (value: boolean) => void,
  setIsGameStarted: (value: boolean) => void,
  setIsTutorialImage1End: (value: boolean) => void,
  setIsTutorialImage2End: (value: boolean) => void,
  setIsSimStarted: (value: boolean) => void,
  setCountdown: (value: number | null) => void,
  setTimeLimit: (value: number | null) => void,
  setResultState: (value: number | null) => void,
) => {

  return useStageStart(
    nestjsSocketRef,
    gameRoomID,
    userName,
    isGameStarted,
    isTutorialImage1End,
    isTutorialImage2End,
    isSimStarted,
    countdown,
    timeLimit,
    5,  // firstImageTime
    5,  // secondImageTime
    30, // chatTime
    60, // simTime
    resultState,
    setIsPlayerReady,
    setIsGameStarted,
    setIsTutorialImage1End,
    setIsTutorialImage2End,
    setIsSimStarted,
    setCountdown,
    setTimeLimit,
    setResultState
  );
};

const useStageStart = (
    nestjsSocketRef: React.MutableRefObject<Socket | null>,
    gameRoomID: string,
    userName: string,
    isGameStarted: boolean,
    isTutorialImage1End: boolean,
    isTutorialImage2End: boolean,
    isSimStarted: boolean,
    countdown: number | null,
    timeLimit: number | null,
    firstImageTime: number,
    secondImageTime: number,
    chatTime: number,
    simTime: number,
    resultState: number | null,
    setIsPlayerReady: (value: boolean) => void,
    setIsGameStarted: (value: boolean) => void,
    setIsTutorialImage1End: (value: boolean) => void,
    setIsTutorialImage2End: (value: boolean) => void,
    setIsSimStarted: (value: boolean) => void,
    setCountdown: (value: number | null) => void,
    setTimeLimit: (value: number | null) => void,
    setResultState: (value: number | null) => void,
) => {
    useEffect(() => {
        if (nestjsSocketRef.current) {
            nestjsSocketRef.current.on(
            "response-ready",
            (players: [string, string, boolean][]) => {
                const readyPlayers = players.filter(
                (player: [string, string, boolean]) => player[2] === true
                );
                if (readyPlayers.length === 1) {
                    setIsGameStarted(true);
                    setResultState(null);
                }
            }
            );
        }
    }, []);
    
    const readyGame = () => {
        if (nestjsSocketRef.current) {
            nestjsSocketRef.current.emit("ready-game", {
            roomName: gameRoomID,
            userName,
            });
            setCountdown(firstImageTime);
            setIsPlayerReady(true);
        }
    };

  // 첫 번째 튜토리얼 이미지 띄우기
  useEffect(() => {
    if (isGameStarted && !isTutorialImage1End && countdown && countdown > 0) {
      const interval = setInterval(() => {
        setCountdown((prevCount: number | null) => (prevCount !== null && prevCount > 0 ? prevCount - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    } else if (isGameStarted && !isTutorialImage1End && countdown === 0) {
      setIsTutorialImage1End(true);
      setCountdown(secondImageTime);
    }
  }, [isGameStarted, countdown, isTutorialImage1End]);

  // 두 번째 튜토리얼 이미지 띄우기
  useEffect(() => {
    if (isTutorialImage1End && !isTutorialImage2End && countdown && countdown > 0) {
      const interval = setInterval(() => {
        setCountdown((prevCount: number | null) => (prevCount !== null && prevCount > 0 ? prevCount - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    } else if (isTutorialImage1End && !isTutorialImage2End && countdown === 0) {
      setIsTutorialImage2End(true);
      setCountdown(chatTime);
    }
  }, [isTutorialImage1End, countdown, isTutorialImage2End]);

  // 작전 타임 시작
  useEffect(() => {
    if (isTutorialImage2End && !isSimStarted && countdown && countdown > 0) {
      const interval = setInterval(() => {
        setCountdown((prevCount: number | null) => (prevCount !== null && prevCount > 0 ? prevCount - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    } else if (isTutorialImage2End && !isSimStarted && countdown === 0) {
      setIsSimStarted(true);
      setCountdown(null);
      setTimeLimit(simTime);
    }
  }, [isTutorialImage2End, countdown, isSimStarted]);

  // 시뮬레이션 제한 시간
  useEffect(() => {
    if (isSimStarted && timeLimit && timeLimit > 0) {
      const interval = setInterval(() => {
        if (resultState !== null) {
          clearInterval(interval);
          return;
        }
        setTimeLimit((prevCount: number | null) => (prevCount !== null && prevCount > 0 ? prevCount - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    } else if (isSimStarted && timeLimit === 0) {
      setResultState(1);
      setTimeLimit(null);
    }
  }, [isSimStarted, timeLimit]);

  return { readyGame }
};

export default useStageStart;