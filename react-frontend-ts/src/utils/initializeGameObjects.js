import { Bodies, World } from "matter-js";

export const initializeGameObjects = (engine, refs) => {
  const { canvasSize, mouseRef, bombRef, leftArmLeftRef, rightHand1RightRef, rightHand2RightRef } = refs;

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
  rightHand1RightRef.current = Bodies.rectangle(
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
  rightHand2RightRef.current = Bodies.rectangle(
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
    rightHand1RightRef.current,
    rightHand2RightRef.current,
    goal,
    goalArrow,
  ]);
};
