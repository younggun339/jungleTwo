// useSimulation.ts
import { useEffect } from 'react';
import { MutableRefObject } from 'react';
import { Body } from 'matter-js';
import { Socket } from 'socket.io-client';

interface UseSimulationProps {
  isSimStarted: boolean;
  leftArmLeftRef: MutableRefObject<Body | null>;
  rightArmRightRef: MutableRefObject<Body | null>;
  mouseRef: MutableRefObject<Body | null>;
  bombRef: MutableRefObject<Body | null>;
  nestjsSocketRef: MutableRefObject<Socket | null>;
  explodeBomb: () => void;
  winGame: () => void;
  loseGame: () => void;
}

const useSimulation = ({
  isSimStarted,
  leftArmLeftRef,
  rightArmRightRef,
  mouseRef,
  bombRef,
  nestjsSocketRef,
  explodeBomb,
  winGame,
  loseGame,
}: UseSimulationProps) => {
  useEffect(() => {
    if (
      isSimStarted &&
      leftArmLeftRef.current &&
      rightArmRightRef.current &&
      leftArmLeftRef.current.vertices.length > 1 &&
      rightArmRightRef.current.vertices.length > 1
    ) {
      const fixedRef1 = {
        x: leftArmLeftRef.current.position.x,
        y: leftArmLeftRef.current.position.y,
        width: Math.abs(leftArmLeftRef.current.vertices[1].x - leftArmLeftRef.current.vertices[0].x),
        angle: leftArmLeftRef.current.angle,
      };
      const fixedRef2 = {
        x: rightArmRightRef.current.position.x,
        y: rightArmRightRef.current.position.y,
        width: Math.abs(rightArmRightRef.current.vertices[1].x - rightArmRightRef.current.vertices[0].x),
        angle: rightArmRightRef.current.angle,
      };

      fetch("/simulation-start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fixedRef1,
          fixedRef2,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.isBombed) {
            explodeBomb();
          }
          if (data.isGameClear) {
            winGame();
          } else {
            loseGame();
          }
        })
        .catch((error) => console.error("Error sending simulation start:", error));
    }
  }, [isSimStarted]);

  useEffect(() => {
    if (isSimStarted) {
      const handleMouseJourney = (data: any) => {
        Body.setPosition(mouseRef.current!, { x: data.mousePos.x, y: data.mousePos.y });
        Body.setPosition(bombRef.current!, { x: data.bombPos.x, y: data.bombPos.y });
        Body.setAngle(bombRef.current!, data.bombAngle);
      };

      nestjsSocketRef.current?.on("mouse-journey", handleMouseJourney);

      return () => {
        nestjsSocketRef.current?.off("mouse-journey", handleMouseJourney);
      };
    }
  }, [isSimStarted]);
};

export default useSimulation;
