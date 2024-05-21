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
import { engine } from "@tensorflow/tfjs";

const useSimulation = (
  isSimStarted: boolean,
  leftArmLeftRef: MutableRefObject<Body | null>,
  rightArmRightRef: MutableRefObject<Body | null>,
  mouseRef: MutableRefObject<Body | null>,
  bombRefLeft: MutableRefObject<Body | null>,
  bombRefRight: MutableRefObject<Body | null>,
  engineRef: MutableRefObject<Engine | null>,
  isRightPointer: boolean,
  playSound: (path: string) => void
) => {
  // 쥐의 x 방향 속도를 0.85로 설정하는 beforeUpdate Events
  useEffect(() => {
    console.log("useSimulation called", isSimStarted);
    const setVelocityAlways = () => {
      if (mouseRef.current) {
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
      bombRefLeft.current &&
      bombRefRight.current &&
      engineRef.current
    ) {
      // leftArmLeftRef.current 및 rightArmRightRef.current의 width 정의
      Events.on(engineRef.current, "collisionActive", (event) => {
        const pairs = event.pairs;
  
        pairs.forEach((pair) => {
          const bodyA = pair.bodyA;
          const bodyB = pair.bodyB;
          if (
            (bodyA === mouseRef.current && bodyB.label === "load") ||
            (bodyA.label === "load" && bodyB === mouseRef.current)
          ) {
            setVelocityAlways();
          }
        });
      });
    }
  }, [isSimStarted, isRightPointer]);

  // 시뮬레이션이 시작했을 때 기물 그리고 에스컬레이터 알고리즘 적용.
  useEffect(() => {
    const runner = Runner.create();
    let leftArmTerrain = Bodies.rectangle(0, 0, 0, 0);
    let rightArmTerrain = Bodies.rectangle(0, 0, 0, 0);

    function explosionLeft() {
      // Bomb가 없어지고 bombGround가 없어진다.
      if (engineRef.current && bombRefLeft.current && leftArmTerrain) {
        playSound("/sound/Bomb.wav");
        World.remove(engineRef.current.world, bombRefLeft.current);
        World.remove(engineRef.current.world, leftArmTerrain);
      }
    }
    function explosionRight() {
      // Bomb가 없어지고 bombGround가 없어진다.
      if (engineRef.current && bombRefLeft.current && rightArmTerrain) {
        playSound("/sound/Bomb.wav");
        World.remove(engineRef.current.world, bombRefLeft.current);
        World.remove(engineRef.current.world, rightArmTerrain);
      }
    }

    if (
      isSimStarted &&
      leftArmLeftRef.current &&
      rightArmRightRef.current &&
      mouseRef.current &&
      bombRefLeft.current &&
      bombRefRight.current &&
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
          label: "load",
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
          label: "load",
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
      Body.setStatic(bombRefLeft.current, false);
      Body.setStatic(bombRefRight.current, false);

      Runner.run(runner, engineRef.current);

      Events.on(engineRef.current, "collisionStart", (event) => {
        const pairs = event.pairs;

        pairs.forEach((pair) => {
          const bodyA = pair.bodyA;
          const bodyB = pair.bodyB;
          if (
            (bodyA === leftArmTerrain && bodyB === bombRefLeft.current) ||
            (bodyA === bombRefLeft.current && bodyB === leftArmTerrain)
          ) {
            explosionLeft();
          }
        });

        pairs.forEach((pair) => {
          const bodyA = pair.bodyA;
          const bodyB = pair.bodyB;
          if (
            (bodyA === rightArmTerrain && bodyB === bombRefRight.current) ||
            (bodyA === bombRefRight.current && bodyB === rightArmTerrain)
          ) {
            explosionRight();
          }
        });
      });
    }
    
    return () => {
      if (engineRef.current) {
        Composite.remove(engineRef.current.world, leftArmTerrain, true);
        Composite.remove(engineRef.current.world, rightArmTerrain, true);
      }
      Runner.stop(runner);
    };
  }, [isSimStarted]);
};

export default useSimulation;