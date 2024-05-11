// useSimulation.ts
import { useEffect } from 'react';
import { MutableRefObject } from 'react';
import { Body } from 'matter-js';
import { Socket } from 'socket.io-client';

interface UseSimulationProps {
  isSimStarted: boolean;
  leftArmLeftRef: MutableRefObject<Body | null>;
  rightHand1RightRef: MutableRefObject<Body | null>;
  rightHand2RightRef: MutableRefObject<Body | null>;
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
  rightHand1RightRef,
  rightHand2RightRef,
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
      rightHand1RightRef.current &&
      rightHand2RightRef.current &&
      leftArmLeftRef.current.vertices.length > 1 &&
      rightHand1RightRef.current.vertices.length > 1 &&
      rightHand2RightRef.current.vertices.length > 1
    ) {
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
