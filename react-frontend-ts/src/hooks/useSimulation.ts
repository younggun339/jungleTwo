// useSimulation.ts
import { useEffect } from 'react';
import { MutableRefObject } from 'react';
import { Engine, Body, Events } from 'matter-js';

interface UseSimulationProps {
  isSimStarted: boolean;
  leftArmLeftRef: MutableRefObject<Body | null>;
  rightArmRightRef: MutableRefObject<Body | null>;
  mouseRef: MutableRefObject<Body | null>;
  bombRef: MutableRefObject<Body | null>;
  engineRef: MutableRefObject<Engine | null>;
}

const useSimulation = ({
  isSimStarted,
  leftArmLeftRef,
  rightArmRightRef,
  mouseRef,
  bombRef,
  engineRef,
}: UseSimulationProps) => {
  
  useEffect(() => {
    const applyContinuousForce = () => {
      if (mouseRef.current) {
        Body.applyForce(mouseRef.current, mouseRef.current.position, { x: 0.04, y: 0 });
        Body.setAngle(mouseRef.current, 0);
      }
    };

    if (
      isSimStarted &&
      leftArmLeftRef.current &&
      rightArmRightRef.current &&
      leftArmLeftRef.current.vertices.length > 1 &&
      rightArmRightRef.current.vertices.length > 1 &&
      mouseRef.current &&
      bombRef.current
    ) {
      // 왼팔 및 오른팔 충돌 ON
      leftArmLeftRef.current.collisionFilter.mask = 0xffff;
      rightArmRightRef.current.collisionFilter.mask = 0xffff;

      // 쥐를 움직이기 위해 static 해제
      Body.setStatic(mouseRef.current, false);
      Body.setStatic(bombRef.current, false);
      Events.on(engineRef.current, "beforeUpdate", applyContinuousForce);
    }

    return () => {
      Events.off(engineRef.current, "beforeUpdate", applyContinuousForce);
    };
  }, [isSimStarted]);
};

export default useSimulation;
