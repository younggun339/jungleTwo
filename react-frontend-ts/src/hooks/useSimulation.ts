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
    // 여기에 updateVelocity 함수 정의
    // const updateVelocity = (mouse: Body, angle: number): void => {
    //   if (angle === Math.PI) {
    //     // Keep current velocity if angle is flat
    //     Body.setVelocity(mouse, mouse.velocity);
    //   } else {
    //     let modifiedAngle = angle;
    //     if (mouse.velocity.x < 0) {
    //       modifiedAngle *= mouse.angle > 0 ? -3 : 3;
    //     } else {
    //       modifiedAngle *= mouse.angle > 0 ? -3 : 3;
    //     }
    //     const normalVector = {
    //       x: Math.sin(modifiedAngle),
    //       y: 0, // Assuming only horizontal movement is needed
    //     };
    //     const parallelComponent = Vector.mult(normalVector, 0.9); // originalSpeedX
    //     Body.setVelocity(mouse, parallelComponent);
    //   }
    // };
    const updateVelocity = (mouse: Body, angle: number): void => {
      if (angle === 0) {
        // Keep current velocity if angle is flat
        Body.setVelocity(mouse, mouse.velocity);
      } else {
        // Calculate the desired velocity direction based on the angle
        const normalVector = {
          x: Math.cos(angle), // Assuming the angle is in radians
          y: Math.sin(angle)  // This will provide a downward component for descending
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
    }

    let onSlope = false;
    let onSlopeRight = false;
    const originalSpeedX = 0.9;

    const liftSlopeStart = (event: IEventCollision<Matter.Engine>) => {
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

    if (engineRef?.current) {
      Events.on(engineRef.current, "collisionStart", liftSlopeStart);
      Events.on(engineRef.current, "collisionEnd", liftSlopeEnd);
      Events.on(engineRef.current, "beforeUpdate", updateVelocityAll);
    }

    return () => {
      if (engineRef.current) {
        engineRef.current!.world.gravity.y = 0;
        engineRef.current!.world.gravity.x = 0;
        Composite.remove(engineRef.current.world, leftArmTerrain, true);
        Composite.remove(engineRef.current.world, rightArmTerrain, true);
        Events.off(engineRef.current, "beforeUpdate", applyContinuousForce);
        Events.off(engineRef.current, "collisionStart", liftSlopeStart);
        Events.off(engineRef.current, "collisionEnd", liftSlopeEnd);
        Events.off(engineRef.current, "beforeUpdate", updateVelocityAll);
      }
      Runner.stop(runner);
    };
  }, [isSimStarted]);
};

export default useSimulation;
