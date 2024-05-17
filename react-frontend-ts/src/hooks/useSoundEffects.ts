// hooks/useSoundEffects.ts
import { useCallback } from "react";

const useSoundEffects = () => {
  const playSound = useCallback((src: string) => {
    const sound = new Audio(src);
    sound.play();
  }, []);

  return playSound;
};

export default useSoundEffects;
//  playSound("path/to/click/sound.mp3");
