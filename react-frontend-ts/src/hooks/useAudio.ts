import { useRef, useEffect, useCallback } from "react";

type UseAudioProps = {
  initialSrc: string;
};

const useAudio = ({ initialSrc }: UseAudioProps) => {
  // 오디오 객체를 ref로 관리합니다.
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 오디오 재생 시도
  const play = useCallback(async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.play();
      } catch (err) {
        console.error("Audio play failed:", err);
      }
    }
  }, []);

  // 오디오 일시 정지
  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  // 오디오 소스 변경
  const changeSource = useCallback(
    (newSrc: string) => {
      if (audioRef.current) {
        pause();
        audioRef.current.src = newSrc;
        play();
      }
    },
    [play, pause]
  );

  // 오디오 반복 재생 설정
  const setLoop = useCallback((isLooping: boolean) => {
    if (audioRef.current) {
      audioRef.current.loop = isLooping;
    }
  }, []);

  // 볼륨 조절
  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, []);

  // 컴포넌트 마운트 시 오디오 자동 재생 시도
  useEffect(() => {
    audioRef.current = new Audio(initialSrc);

    // 페이지 로드 완료 후 오디오 재생 시도
    const playAudioAfterLoad = async () => {
      await play();
    };

    playAudioAfterLoad();

    // 컴포넌트 언마운트 시 오디오 리소스 정리
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [initialSrc, play]);

  // 사용자 상호작용에 의한 오디오 재생 보장
  useEffect(() => {
    const handleFirstInteraction = async () => {
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
      await play();
    };

    document.addEventListener("click", handleFirstInteraction);
    document.addEventListener("keydown", handleFirstInteraction);

    return () => {
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
    };
  }, [play]);

  return { play, pause, changeSource, setLoop, setVolume };
};

export default useAudio;
