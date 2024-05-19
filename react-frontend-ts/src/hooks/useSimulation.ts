// useSimulation.ts
import { useEffect } from "react";
import { MutableRefObject } from "react";
import {
  Runner,
  Engine,
  Body,
  Events,
  Bodies,
  World,
  Composite,
  IEventCollision,
  Vector,
} from "matter-js";
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
        Body.applyForce(mouseRef.current, mouseRef.current.position, {
          x: 0.0001,
          y: 0,
        });
        Body.setAngle(mouseRef.current, 0);
      }
    };

    let leftArmTerrain = Bodies.rectangle(0, 0, 0, 0);
    let rightArmTerrain = Bodies.rectangle(0, 0, 0, 0);
    const runner = Runner.create();
    const updateVelocity = (mouse: Body, angle: number): void => {
      console.log(
        `Called updateVelocity with angle: ${angle} radians (${
          angle * (180 / Math.PI)
        } degrees) and initial velocity: (${mouse.velocity.x}, ${
          mouse.velocity.y
        })`
      );

      if (angle === Math.PI) {
        // Keep current velocity if angle is flat
        Body.setVelocity(mouse, mouse.velocity);
        console.log(
          `Flat surface detected, velocity unchanged: (${mouse.velocity.x}, ${mouse.velocity.y})`
        );
      } else {
        const modifiedAngle = angle * (mouse.velocity.x < 0 ? -1 : 1);
        console.log(
          `Modified angle based on velocity direction: ${modifiedAngle} radians (${
            modifiedAngle * (180 / Math.PI)
          } degrees)`
        );

        // Calculate normal vector based on the angle, enhanced for steep inclines
        const normalVector = {
          x: Math.cos(modifiedAngle),
          y: -Math.sin(modifiedAngle),
        };
        console.log(
          `Calculated normal vector: (${normalVector.x}, ${normalVector.y})`
        );

        // Increase the y-component for steeper slopes
        const speedMultiplier = Math.abs(angle) > 0.1 ? 1.5 : 1;
        console.log(`Speed multiplier based on steepness: ${speedMultiplier}`);

        const parallelComponent = {
          x: normalVector.x * originalSpeedX,
          y: normalVector.y * originalSpeedX * speedMultiplier,
        };
        console.log(
          `Calculated parallel component of velocity: (${parallelComponent.x}, ${parallelComponent.y})`
        );

        Body.setVelocity(mouse, parallelComponent);
        console.log(
          `New velocity set to: (${parallelComponent.x}, ${parallelComponent.y})`
        );
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
      // leftArmLeftRef.current 및 rightArmRightRef.current의 width 정의
      const leftArmWidth = Math.sqrt(
        Math.pow(
          leftArmLeftRef.current.vertices[0].x -
            leftArmLeftRef.current.vertices[1].x,
          2
        ) +
          Math.pow(
            leftArmLeftRef.current.vertices[0].y -
              leftArmLeftRef.current.vertices[1].y,
            2
          )
      );
      const rightArmWidth = Math.sqrt(
        Math.pow(
          rightArmRightRef.current.vertices[0].x -
            rightArmRightRef.current.vertices[1].x,
          2
        ) +
          Math.pow(
            rightArmRightRef.current.vertices[0].y -
              rightArmRightRef.current.vertices[1].y,
            2
          )
      );

      leftArmTerrain = Bodies.rectangle(
        leftArmLeftRef.current.position.x,
        leftArmLeftRef.current.position.y,
        leftArmWidth,
        5,
        {
          isStatic: true,
          angle: leftArmLeftRef.current.angle,
          render: {
            sprite: {
              texture: "/sprite/Ground4.png",
              yScale: 15 / 62.5,
              xScale: leftArmWidth / 247.06,
            },
          },
        }
      );

      rightArmTerrain = Bodies.rectangle(
        rightArmRightRef.current.position.x,
        rightArmRightRef.current.position.y,
        rightArmWidth,
        5,
        {
          isStatic: true,
          angle: rightArmRightRef.current.angle,
          render: {
            sprite: {
              texture: "/sprite/Ground4.png",
              yScale: 15 / 62.5,
              xScale: rightArmWidth / 247.06,
            },
          },
        }
      );

      World.add(engineRef.current.world, [leftArmTerrain, rightArmTerrain]);

      // leftArmLeftRef과 rightArmRightRef의 width를 0으로 설정
      Body.setVertices(leftArmLeftRef.current, [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
      ]);
      Body.setVertices(rightArmRightRef.current, [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
      ]);

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
    let onSlopeRight = false;
    const originalSpeedX = 0.9;

    if (engineRef?.current) {
      Events.on(
        engineRef.current,
        "collisionStart",
        (event: IEventCollision<Matter.Engine>) => {
          event.pairs.forEach((pair) => {
            const { bodyA, bodyB } = pair;

            if (
              (bodyA === mouseRef?.current && bodyB === leftArmTerrain) ||
              (bodyA === leftArmTerrain && bodyB === mouseRef?.current)
            ) {
              onSlope = true;
            }

            if (
              (bodyA === mouseRef?.current && bodyB === rightArmTerrain) ||
              (bodyA === rightArmTerrain && bodyB === mouseRef?.current)
            ) {
              onSlopeRight = true;
            }
          });
        }
      );

      Events.on(
        engineRef.current,
        "collisionEnd",
        (event: IEventCollision<Matter.Engine>) => {
          event.pairs.forEach((pair) => {
            const { bodyA, bodyB } = pair;

            if (
              (bodyA === mouseRef?.current && bodyB === leftArmTerrain) ||
              (bodyA === leftArmTerrain && bodyB === mouseRef?.current)
            ) {
              onSlope = false;
            }

            if (
              (bodyA === mouseRef?.current && bodyB === rightArmTerrain) ||
              (bodyA === rightArmTerrain && bodyB === mouseRef?.current)
            ) {
              onSlopeRight = false;
            }
          });
        }
      );

      Events.on(engineRef.current, "beforeUpdate", () => {
        if (onSlope && mouseRef.current) {
          updateVelocity(mouseRef.current, leftArmTerrain.angle);
        }

        if (onSlopeRight && mouseRef.current) {
          updateVelocity(mouseRef.current, rightArmTerrain.angle);
        }
      });
    }

    return () => {
      if (engineRef.current) {
        engineRef.current!.world.gravity.y = 0;
        engineRef.current!.world.gravity.x = 0;
        Composite.remove(engineRef.current.world, leftArmTerrain, true);
        Composite.remove(engineRef.current.world, rightArmTerrain, true);
        Events.off(engineRef.current, "beforeUpdate", applyContinuousForce);
      }
      Runner.stop(runner);
    };
  }, [isSimStarted]);
};

export default useSimulation;
