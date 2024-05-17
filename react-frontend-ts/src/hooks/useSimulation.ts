// useSimulation.ts
import { useEffect } from "react";
import { MutableRefObject } from "react";
import { Runner, Engine, Body, Events, } from "matter-js";

interface UseSimulationProps {
  isSimStarted: boolean;
  leftArmLeftRef: MutableRefObject<Body | null>;
  rightArmRightRef: MutableRefObject<Body | null>;
  mouseRef: MutableRefObject<Body | null>;
  bombRef: MutableRefObject<Body | null>;
  engineRef: MutableRefObject<Engine | null>;
  runner: Runner;
}

const useSimulation = ({
  isSimStarted,
  leftArmLeftRef,
  rightArmRightRef,
  mouseRef,
  bombRef,
  engineRef,
  runner
}: UseSimulationProps) => {
  useEffect(() => {
    console.log("useSimulation called", isSimStarted);
    const applyContinuousForce = () => {
      if (mouseRef.current) {
        Body.applyForce(mouseRef.current, mouseRef.current.position, { x: 0.0001, y: 0 });
        Body.setAngle(mouseRef.current, 0);
      }
    };

    if (
      isSimStarted &&
      leftArmLeftRef.current &&
      rightArmRightRef.current &&
      mouseRef.current &&
      bombRef.current &&
      engineRef.current
    ) {
       console.log("시뮬레이션 시작");
       engineRef.current!.world.gravity.y = 0.15;
       Runner.run(runner, engineRef.current);
       Engine.run(engineRef.current);
      // engineRef.current!.world.gravity.x = 0.04;

      // 쥐를 움직이기 위해 static 해제
      Body.setStatic(mouseRef.current, false);
      Body.setStatic(bombRef.current, false);
      // Events.on(engineRef.current, "beforeUpdate", applyContinuousForce);
      // setInterval(() => {
      //     console.log(mouseRef.current);
      // }, 200);
    }

    return () => {
      Runner.stop(runner);
      Events.off(engineRef.current, "beforeUpdate", applyContinuousForce);
    };
  }, [isSimStarted]);
};

export default useSimulation;
