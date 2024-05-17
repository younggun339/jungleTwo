// useSimulation.ts
import { useEffect } from "react";
import { MutableRefObject } from "react";
import { Runner, Engine, Body, Events, Bodies, World, Composite, IEventCollision, Vector } from "matter-js";
import { on } from "events";

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
    console.log("useSimulation called", isSimStarted);
    const applyContinuousForce = () => {
      if (mouseRef.current) {
        Body.applyForce(mouseRef.current, mouseRef.current.position, { x: 0.0001, y: 0 });
        Body.setAngle(mouseRef.current, 0);
      }
    };

    let leftArmTerrain = Bodies.rectangle(0, 0, 0, 0);
    let rightArmTerrain = Bodies.rectangle(0, 0, 0, 0);

    const runner = Runner.create();
    if (
      isSimStarted &&
      leftArmLeftRef.current &&
      rightArmRightRef.current &&
      mouseRef.current &&
      bombRef.current &&
      engineRef.current
    ) {
       console.log("시뮬레이션 시작");

       leftArmTerrain = Bodies.rectangle(
        leftArmLeftRef.current.position.x,
        leftArmLeftRef.current.position.y,
        leftArmLeftRef.current.bounds.max.x - leftArmLeftRef.current.bounds.min.x,
        15,
        {
          isStatic: true,
          angle: leftArmLeftRef.current.angle
         }
      );

      rightArmTerrain = Bodies.rectangle(
        rightArmRightRef.current.position.x,
        rightArmRightRef.current.position.y,
        rightArmRightRef.current.bounds.max.x - rightArmRightRef.current.bounds.min.x,
        15,
        {
          isStatic: true,
          angle: leftArmLeftRef.current.angle
         }
      );

      World.add(engineRef.current.world, [leftArmTerrain, rightArmTerrain]);

      Composite.remove(engineRef.current.world, leftArmLeftRef.current, true);
      Composite.remove(engineRef.current.world, rightArmRightRef.current, true);
      
       engineRef.current!.world.gravity.y = 0.15;
       engineRef.current!.world.gravity.x = 0.04;
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

    let onSlope = false;
    let onSlopeRight = false
    const originalSpeedX = 0.9;

    if (engineRef?.current) {
      Events.on(engineRef.current, "collisionStart", (event: IEventCollision<Matter.Engine>) => {
        event.pairs.forEach((pair) => {
          const { bodyA, bodyB } = pair;
    
          if (
            (bodyA === mouseRef?.current && bodyB === leftArmTerrain) ||
            (bodyA === leftArmTerrain && bodyB === mouseRef?.current)
          ) {
            onSlope = true;
            console.log("쥐: ", mouseRef?.current);
          }
    
          if (
            (bodyA === mouseRef?.current && bodyB === rightArmTerrain) ||
            (bodyA === rightArmTerrain && bodyB === mouseRef?.current)
          ) {
            onSlopeRight = true;
          }
        });
      });
    
      Events.on(engineRef.current, "beforeUpdate", () => {
        if (onSlopeRight && mouseRef.current) {
          const angle = rightArmTerrain.angle;
          if (angle === Math.PI) {
            Body.setVelocity(mouseRef!.current, mouseRef!.current.velocity);
          } else {
            let modifiedAngle = angle;
            if (mouseRef!.current.velocity.x < 0) {
              modifiedAngle *= mouseRef!.current.angle > 0 ? -3 : 3;
            } else {
              modifiedAngle *= mouseRef!.current.angle > 0 ? -3 : 3;
            }
            const normalVector = {
              x: Math.sin(modifiedAngle),
              y: Math.cos(angle) * 0,
            };
            const parallelComponent = Vector.mult(normalVector, originalSpeedX);
            Body.setVelocity(mouseRef!.current, parallelComponent);
          }
        }
    
        if (onSlope && mouseRef.current) {
          console.log("*****************", mouseRef?.current);
          const angle = leftArmTerrain.angle;
          if (angle === Math.PI) {
            Body.setVelocity(mouseRef!.current, mouseRef!.current.velocity);
          } else {
            let modifiedAngle = angle;
            if (mouseRef!.current.velocity.x < 0) {
              modifiedAngle *= mouseRef!.current.angle > 0 ? 3 : -3;
            } else {
              modifiedAngle *= mouseRef!.current.angle > 0 ? -3 : 3;
            }
            const normalVector = {
              x: Math.sin(modifiedAngle),
              y: Math.cos(angle) * 0,
            };
            const parallelComponent = Vector.mult(normalVector, originalSpeedX);
            Body.setVelocity(mouseRef!.current, parallelComponent);
          }
        }
      });
    }

    return () => {
      Runner.stop(runner);
      Events.off(engineRef.current, "beforeUpdate", applyContinuousForce);
    };
  }, [isSimStarted]);
};

export default useSimulation;
