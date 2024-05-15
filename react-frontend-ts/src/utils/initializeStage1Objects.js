import { Events, Bodies, World } from "matter-js";

export const initializeStage1Objects = (engine, refs, isTutorialImage2End, setResultState) => {
  const { canvasSize, mouseRef, bombRef, leftArmLeftRef, rightArmRightRef } = refs;

  const walls = [
    Bodies.rectangle(canvasSize.x / 2, 0, canvasSize.x, 50, { isStatic: true }),
    Bodies.rectangle(canvasSize.x / 2, canvasSize.y, canvasSize.x, 50, {
      isStatic: true,
    }),
    Bodies.rectangle(0, canvasSize.y / 2, 50, canvasSize.y, { isStatic: true }),
    Bodies.rectangle(canvasSize.x, canvasSize.y / 2, 50, canvasSize.y, {
      isStatic: true,
    }),
  ];
  
  if (!isTutorialImage2End) {
    World.add(engine.world, walls);

  } else {
    const platforms = [
      Bodies.rectangle(100, 200, 200, 30, {
        isStatic: true,
        render: { sprite: { texture: "/assets/platform_1.png", xScale: 2, yScale: 1 }}
      }),
      Bodies.rectangle(1500, 400, 200, 30, {
        isStatic: true,
        render: { sprite: { texture: "/assets/platform_1.png", xScale: 2, yScale: 1 }}
      }),
      Bodies.rectangle(1300, 400, 200, 30, {
        isStatic: true,
        render: { sprite: { texture: "/assets/platform_1.png", xScale: 2, yScale: 1 }}
      }),
      Bodies.rectangle(1100, 400, 200, 30, {
        isStatic: true,
        render: { sprite: { texture: "/assets/platform_1.png", xScale: 2, yScale: 1 }}
      }),
      Bodies.rectangle(900, 400, 200, 30, {
        isStatic: true,
        render: { sprite: { texture: "/assets/platform_1.png", xScale: 2, yScale: 1 }}
      })
    ];
  
    const goalArrow = Bodies.polygon(1300, 250, 3, 20, {
      isStatic: true,
      label: "goal",
      render: { sprite: { texture: "/assets/goal_arrow.png", xScale: 0.65, yScale: 0.65 }},
      collisionFilter: { mask: 0 }
    });
    const goal = Bodies.polygon(1300, 350, 3, 20, {
      isStatic: true,
      label: "goal",
      render: { sprite: {
          texture: "/assets/goal.png",
          xScale: 0.65,
          yScale: 0.65
        }
      },
    });
  
    bombRef.current = Bodies.circle(1000, 100, 30, {
      isStatic: true,
      restitution: 0.5,
      friction: 0.3,
      density: 0.05,
      render: {
        sprite: {
          texture: "/assets/bomb.png",
          xScale: 0.65,
          yScale: 0.65
        }
      },
    });
  
    mouseRef.current = Bodies.circle(100, 100, 30, {
      isStatic: true,
      restitution: 0.5,
      friction: 0.3,
      density: 0.05,
      render: {
        sprite: {
          texture: "/assets/mouse_stand.png",
          xScale: 0.65,
          yScale: 0.65
        }
      },
    });
  
    const spikes = [];
    const numberOfSpikes = 36;
    const spikeWidth = canvasSize.x / numberOfSpikes;
    for (let i = 0; i < numberOfSpikes; i++) {
      const spike = Bodies.polygon(
        spikeWidth / 2 + i * spikeWidth,
        canvasSize.y - 50,
        3,
        20,
        {
          isStatic: true,
          render: {
            sprite: {
              texture: "/assets/spike.png",
              xScale: 0.65,
              yScale: 0.65
            }
          },
          collisionFilter: { mask: 0 }
        }
      );
      spikes.push(spike);
    }
  
    leftArmLeftRef.current = Bodies.rectangle(
      canvasSize.x / 4,
      canvasSize.y / 2,
      0,
      15,
      {
        isStatic: true,
        angle: 0,
        collisionFilter: { mask: 0 },
        render: {
          fillStyle: "blue",
          strokeStyle: "black",
          lineWidth: 1,
        },
      }
    );
    rightArmRightRef.current = Bodies.rectangle(
      canvasSize.x * 3 / 4,
      canvasSize.y / 2,
      0,
      15,
      {
        isStatic: true,
        angle: 0,
        collisionFilter: { mask: 0 },
        render: {
          fillStyle: "blue",
          strokeStyle: "black",
          lineWidth: 1,
        },
      }
    );

    World.add(engine.world, [
      ...walls,
      ...spikes,
      ...platforms,
      mouseRef.current,
      bombRef.current,
      leftArmLeftRef.current,
      rightArmRightRef.current,
      goal,
      goalArrow,
    ]);

    // Event handling for game goal and game over scenarios
    Events.on(engine, "collisionStart", (event) => {
      event.pairs.forEach((pair) => {
        if (
          (pair.bodyA === mouseRef.current && pair.bodyB === goal) ||
          (pair.bodyB === mouseRef.current && pair.bodyA === goal)
        ) {
          // 게임 클리어
          setResultState(0);
        }
      });
    });

    Events.on(engine, "collisionStart", (event) => {
      event.pairs.forEach((pair) => {
        if (
          (pair.bodyA === mouseRef.current && pair.bodyB === walls[1]) ||
          (pair.bodyB === mouseRef.current && pair.bodyA === walls[1])
        ) {
          // 바닥에 떨어짐
          setResultState(2);
        }
      });
    });

    Events.on(engine, "collisionStart", (event) => {
      event.pairs.forEach((pair) => {
        if (
          (pair.bodyA === mouseRef.current && pair.bodyB === bombRef.current) ||
          (pair.bodyB === mouseRef.current && pair.bodyA === bombRef.current)
        ) {
          // 폭탄에 닿음
          setResultState(3);
        }
      });
    });
  }
};
