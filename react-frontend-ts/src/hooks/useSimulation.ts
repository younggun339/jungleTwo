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

const useSimulation = (
  isSimStarted: boolean,
  leftArmLeftRef: MutableRefObject<Body | null>,
  rightArmRightRef: MutableRefObject<Body | null>,
  mouseRef: MutableRefObject<Body | null>,
  bombRef: MutableRefObject<Body | null>,
  engineRef: MutableRefObject<Engine | null>,
  isRightPointer: boolean,
) => {
  // 쥐의 x 방향 속도를 0.85로 설정하는 beforeUpdate Events
  useEffect(() => {
    console.log("useSimulation called", isSimStarted);
    const setVelocityAlways = () => {
      if (mouseRef.current && mouseRef.current.velocity.y < 0.1) {
        if (!isRightPointer) {
          Body.setVelocity(mouseRef.current, {
            x: 1.8,
            y: mouseRef.current.velocity.y,
          });
        } else {
          Body.setVelocity(mouseRef.current, {
            x: -1.8,
            y: mouseRef.current.velocity.y,
          });
        }
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
      // leftArmLeftRef.current 및 rightArmRightRef.current의 width 정의
      Events.on(engineRef.current, "beforeUpdate", setVelocityAlways);
    }
  }, [isSimStarted, isRightPointer]);

  // 시뮬레이션이 시작했을 때 기물 그리고 에스컬레이터 알고리즘 적용.
  useEffect(() => {
    const runner = Runner.create();
    let leftArmTerrain = Bodies.rectangle(0, 0, 0, 0);
    let rightArmTerrain = Bodies.rectangle(0, 0, 0, 0);
    let onSlope = false;
    let onSlopeRight = false;

    const liftSlopeStart = (event: IEventCollision<Matter.Engine>) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        if (
          (bodyA === mouseRef?.current && bodyB === leftArmTerrain) ||
          (bodyA === leftArmTerrain && bodyB === mouseRef?.current)
        ) {
          console.log("왼쪽 쥐 속도: ", mouseRef.current.velocity);
          onSlope = true;
        }

        if (
          (bodyA === mouseRef?.current && bodyB === rightArmTerrain) ||
          (bodyA === rightArmTerrain && bodyB === mouseRef?.current)
        ) {
          console.log("오른쪽 쥐 속도: ", mouseRef.current.velocity);
          onSlopeRight = true;
        }
      });
    }
    const liftSlopeEnd = (event: IEventCollision<Matter.Engine>) => {
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
    const updateVelocityAll = () => {
      if (onSlope && mouseRef.current) {
        updateVelocity(mouseRef.current, leftArmTerrain.angle);
      }

      if (onSlopeRight && mouseRef.current) {
        updateVelocity(mouseRef.current, rightArmTerrain.angle);
      }
    }

    const updateVelocity = (mouse: Body, angle: number): void => {
      // normalVectoy 선언
      let normalVector = { x: 0, y: 0 };
      if (angle === Math.PI) {
        // Keep current velocity if angle is flat
        Body.setVelocity(mouse, mouse.velocity);
      } else {
        let modifiedAngle = angle;
        // 공이 오른쪽에서 왼쪽으로 가는 경우
        if (mouse.velocity.x < 0) {
            if (angle > 0) {
                modifiedAngle *= -3;
            } else {
                modifiedAngle *= 3; // Math.sin(angle) 값에 -3을 곱합니다.
            }
        } else {
            if (angle > 0) {
                modifiedAngle *= 3;
            } else {
                modifiedAngle *= -3; // Math.sin(angle) 값에 -3을 곱합니다.
            }
        }
        
        normalVector = {
          x: Math.sin(modifiedAngle), // Assuming the angle is in radians
          y: 0  // This will provide a downward component for descending
        };
        // Adjust speed based on angle
        const speed = 0.9; // Example speed multiplier, can be adjusted
        const parallelComponent = Vector.mult(normalVector, speed);
        
        // Set the new velocity to the mouse
        Body.setVelocity(mouse, parallelComponent);
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

      // engineRef의 시간스케일을 1.25로 설정
      engineRef.current!.world.gravity.y = 0.5;
      // 쥐를 움직이기 위해 static 해제
      Body.setStatic(mouseRef.current, false);
      Body.setStatic(bombRef.current, false);

      Runner.run(runner, engineRef.current);

      // Events.on(engineRef.current, "collisionStart", liftSlopeStart);
      // Events.on(engineRef.current, "collisionEnd", liftSlopeEnd);
      // Events.on(engineRef.current, "beforeUpdate", updateVelocityAll);

      return () => {
        if (engineRef.current) {
          Composite.remove(engineRef.current.world, leftArmTerrain, true);
          Composite.remove(engineRef.current.world, rightArmTerrain, true);
        }
        Runner.stop(runner);
      };
    }
  }, [isSimStarted]);
};

export default useSimulation;