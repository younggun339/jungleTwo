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
  resultState: number | null,
  setIsPlayerReady: (value: boolean) => void,
  setIsGameStarted: (value: boolean) => void,
  setIsTutorialImage1End: (value: boolean) => void,
  setIsTutorialImage2End: (value: boolean) => void,
  setIsSimStarted: (value: boolean) => void,
  setCountdown: (value: number | null) => void,
  setResultState: (value: number | null) => void
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
    2, // firstImageTime
    2, // secondImageTime
    3, // chatTime
    20, // simTime
    resultState,
    setIsPlayerReady,
    setIsGameStarted,
    setIsTutorialImage1End,
    setIsTutorialImage2End,
    setIsSimStarted,
    setCountdown,
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
  resultState: number | null,
  setIsPlayerReady: (value: boolean) => void,
  setIsGameStarted: (value: boolean) => void,
  setIsTutorialImage1End: (value: boolean) => void,
  setIsTutorialImage2End: (value: boolean) => void,
  setIsSimStarted: (value: boolean) => void,
  setCountdown: (value: number | null) => void,
  setResultState: (value: number | null) => void
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
    2, // firstImageTime
    2, // secondImageTime
    15, // chatTime
    20, // simTime
    resultState,
    setIsPlayerReady,
    setIsGameStarted,
    setIsTutorialImage1End,
    setIsTutorialImage2End,
    setIsSimStarted,
    setCountdown,
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
  resultState: number | null,
  setIsPlayerReady: (value: boolean) => void,
  setIsGameStarted: (value: boolean) => void,
  setIsTutorialImage1End: (value: boolean) => void,
  setIsTutorialImage2End: (value: boolean) => void,
  setIsSimStarted: (value: boolean) => void,
  setCountdown: (value: number | null) => void,
  setResultState: (value: number | null) => void
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
    2, // firstImageTime
    2, // secondImageTime
    30, // chatTime
    20, // simTime
    resultState,
    setIsPlayerReady,
    setIsGameStarted,
    setIsTutorialImage1End,
    setIsTutorialImage2End,
    setIsSimStarted,
    setCountdown,
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
  resultState: number | null,
  setIsPlayerReady: (value: boolean) => void,
  setIsGameStarted: (value: boolean) => void,
  setIsTutorialImage1End: (value: boolean) => void,
  setIsTutorialImage2End: (value: boolean) => void,
  setIsSimStarted: (value: boolean) => void,
  setCountdown: (value: number | null) => void,
  setResultState: (value: number | null) => void
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
    2, // firstImageTime
    2, // secondImageTime
    10, // chatTime
    20, // simTime
    resultState,
    setIsPlayerReady,
    setIsGameStarted,
    setIsTutorialImage1End,
    setIsTutorialImage2End,
    setIsSimStarted,
    setCountdown,
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
  resultState: number | null,
  setIsPlayerReady: (value: boolean) => void,
  setIsGameStarted: (value: boolean) => void,
  setIsTutorialImage1End: (value: boolean) => void,
  setIsTutorialImage2End: (value: boolean) => void,
  setIsSimStarted: (value: boolean) => void,
  setCountdown: (value: number | null) => void,
  setResultState: (value: number | null) => void
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
    2, // firstImageTime
    2, // secondImageTime
    30, // chatTime
    20, // simTime
    resultState,
    setIsPlayerReady,
    setIsGameStarted,
    setIsTutorialImage1End,
    setIsTutorialImage2End,
    setIsSimStarted,
    setCountdown,
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
  setResultState: (value: number | null) => void
) => {
  useEffect(() => {
    if (nestjsSocketRef.current) {
      nestjsSocketRef.current.on(
        "response-ready",
        (players: [string, string, boolean][]) => {
          const readyPlayers = players.filter(
            (player: [string, string, boolean]) => player[2] === true
          );
          const element0 = document.getElementById("ready0");
          const element1 = document.getElementById("ready1");

          if (players[0][2] === true) {
            element0!.textContent = "O";
          } else {
            element0!.textContent = "X";
          }
          if (players.length === 2) {
            if (players[1][2] === true) {
              element1!.textContent = "O";
            } else {
              element1!.textContent = "X";
            }
          }
          /////////////////////////////////////////////////////////////////////////////////////////////// 레디 인원수 조절
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
        setCountdown((prevCount: number | null) =>
          prevCount !== null && prevCount > 0 ? prevCount - 1 : 0
        );
      }, 1000);
      return () => clearInterval(interval);
    } else if (isGameStarted && !isTutorialImage1End && countdown === 0) {
      setIsTutorialImage1End(true);
      setCountdown(secondImageTime);
    }
  }, [isGameStarted, countdown, isTutorialImage1End]);

  // 두 번째 튜토리얼 이미지 띄우기
  useEffect(() => {
    if (
      isTutorialImage1End &&
      !isTutorialImage2End &&
      countdown &&
      countdown > 0
    ) {
      const interval = setInterval(() => {
        setCountdown((prevCount: number | null) =>
          prevCount !== null && prevCount > 0 ? prevCount - 1 : 0
        );
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
        setCountdown((prevCount: number | null) =>
          prevCount !== null && prevCount > 0 ? prevCount - 1 : 0
        );
      }, 1000);
      return () => clearInterval(interval);
    } else if (isTutorialImage2End && !isSimStarted && countdown === 0) {
      setIsSimStarted(true);
      setCountdown(null);
    }
  }, [isTutorialImage2End, countdown, isSimStarted]);

  // =============== 카운트다운 바 처리 ===============
  useEffect(() => {
    if (isTutorialImage2End && countdown === chatTime) {
      document.getElementById("countdown-bar")!.style.width = "100%";
    }
    if (countdown && countdown > 0) {
      const countdownBar = document.getElementById("countdown-bar");
      if (countdownBar) {
        const percentage = ((countdown - 1) / chatTime) * 100;
        countdownBar.style.width = `${percentage}%`;
      }
    }
  }, [isTutorialImage2End, countdown]);

  return { readyGame };
};

export default useStageStart;
