// src/hooks/useMatterSetupContinuity.js
import { useEffect, useState } from 'react';
import { Engine, Render, Bodies, Body, World, Events } from 'matter-js';
import io from 'socket.io-client';
import { updateLsideSkeleton } from '../utils/updateLsideSkeleton'

const useMatterSetupContinuity = (refs, setGoalReached, setGameStart, setInGameStart) => {
  const { sceneRef, videoRef, engineRef, leftArmRef, rightArmRef, circleRef } = refs;
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const loadImages = async () => {
    const loadImage = src => new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = reject;
      img.src = src;
    });

    try {
      await Promise.all([
        loadImage("/assets/spike.png"),
        loadImage("/assets/mouse_stand.png"),
        loadImage("/assets/goal_arrow.png"),
        loadImage("/assets/platform_1.png"),
        loadImage("/assets/mouse_dead.png")
      ]);
      setImagesLoaded(true);
    } catch (error) {
      console.error("Failed to load one or more images:", error);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  useEffect(() => {
    if (!imagesLoaded) {
      return;
    }

    // ============== matter-js 초기값 세팅 =================
    const canvasSize = { x: 800, y: 600 };

    const engine = engineRef.current;
    engine.world.gravity.y = 0.1;

    const render = Render.create({
      element: document.getElementById("matter-container"),
      engine: engine,
      options: {
        width: canvasSize.x,
        height: canvasSize.y,
        wireframes: false,
        background: "transparent",
      },
    });

    if (!engine.world) {
      console.error("World not initialized");
      return;
    }

    // Define all bodies and add them to the world
    // 왼팔 및 오른팔 사각형 생성
    leftArmRef.current = Bodies.rectangle(canvasSize.x / 2, canvasSize.y / 2, 0, 15, {
        isStatic: true,
        angle: 0,
        collisionFilter: {
          mask: 0
        },
        render: {
          fillStyle: 'blue',
          strokeStyle: 'black',
          lineWidth: 1
        }
    });
      rightArmRef.current = Bodies.rectangle(canvasSize.x / 2, canvasSize.y / 2, 0, 15, {
        isStatic: true,
        angle: 0,
        collisionFilter: {
          mask: 0
        },
        render: {
          fillStyle: 'blue',
          strokeStyle: 'black',
          lineWidth: 1
        }
    });
    const walls = [
      Bodies.rectangle(canvasSize.x / 2, 0, canvasSize.x, 50, { isStatic: true }),
      Bodies.rectangle(canvasSize.x / 2, canvasSize.y, canvasSize.x, 50, { isStatic: true }),
      Bodies.rectangle(0, canvasSize.y / 2, 50, canvasSize.y, { isStatic: true }),
      Bodies.rectangle(canvasSize.x, canvasSize.y / 2, 50, canvasSize.y, { isStatic: true }),
    ];
    const spikes = [];
    const numberOfSpikes = 18;
    const spikeWidth = canvasSize.x / numberOfSpikes;
    for (let i = 0; i < numberOfSpikes; i++) {
      const spike = Bodies.circle(spikeWidth / 2 + i * spikeWidth, canvasSize.y - 50, 30, {
        isStatic: true,
        render: {
          sprite: {
            texture: "/assets/spike.png",
            xScale: 0.65,
            yScale: 0.65
          }
        },
        collisionFilter: {
          mask: 0
        }
      });
      spikes.push(spike);
    }
    const platform_1 = Bodies.rectangle(100, 200, 200, 30, { isStatic: true, render: { sprite: {texture: "/assets/platform_1.png", xScale: 2, yScale: 1 }}});
    const platform_2 = Bodies.rectangle(700, 400, 200, 30, { isStatic: true, render: { sprite: {texture: "/assets/platform_1.png", xScale: 2, yScale: 1 }}});
    const goal = Bodies.circle(700, 350, 30, { isStatic: true, label: "goal", render: { sprite: { texture: "/assets/goal_arrow.png", xScale: 0.65, yScale: 0.65 }}});
    // 센터 오브젝트: 원 생성
    circleRef.current = Bodies.circle(100, 100, 30, {
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

    World.add(engine.world, [
      ...walls, ...spikes, platform_1, platform_2, circleRef.current, leftArmRef.current, rightArmRef.current, goal
    ]);

    Engine.run(engine);
    Render.run(render);
    // ============== matter-js 초기값 세팅 =================


    // ================ 충돌 이벤트 처리 =====================
    Events.on(engine, 'collisionStart', event => {
      event.pairs.forEach(pair => {
        if ((pair.bodyA === circleRef.current && pair.bodyB === goal) ||
            (pair.bodyB === circleRef.current && pair.bodyA === goal)) {
          setGoalReached(true);
          alert("골에 도달했습니다!");
          Body.setVelocity(circleRef.current, { x: 0, y: 0 });  // 원의 움직임을 멈춤
          Body.setPosition(circleRef.current, { x: 100, y: 100 });  // 초기 위치로 리셋
          leftArmRef.current.collisionFilter.mask = 0;
          rightArmRef.current.collisionFilter.mask = 0;
          Body.setStatic(circleRef.current, true);
          setGameStart(false);
          setInGameStart(false);
        }
      });
    });

    Events.on(engine, 'collisionStart', event => {
      event.pairs.forEach(pair => {
        if ((pair.bodyA === circleRef.current && pair.bodyB === walls[1]) ||
            (pair.bodyB === circleRef.current && pair.bodyA === walls[1])) {
          circleRef.current.render.sprite.texture = "/assets/mouse_dead.png";
          alert("바닥에 닿았습니다!");
          Body.setVelocity(circleRef.current, { x: 0, y: 0 });  // 원의 움직임을 멈춤
          Body.setPosition(circleRef.current, { x: 100, y: 100 });  // 초기 위치로 리셋
          leftArmRef.current.collisionFilter.mask = 0;
          rightArmRef.current.collisionFilter.mask = 0;
          Body.setStatic(circleRef.current, true);
          setGameStart(false);
          setInGameStart(false);
          circleRef.current.render.sprite.texture = "/assets/mouse_stand.png";
        }
      });
    });
    // ================ 충돌 이벤트 처리 =====================


    // =============== socket.io 서버에 연결 ================
    const socket = io('http://localhost:5000');
    socket.on('body-coords-L', (data) => {
      // 왼팔, 오른팔 좌표 데이터 추출
      const { joint1Start, joint1End, joint2Start, joint2End } = data;
      updateLsideSkeleton(leftArmRef, joint1Start, joint1End, canvasSize);
      updateLsideSkeleton(rightArmRef, joint2Start, joint2End, canvasSize);
    });
    // =============== socket.io 서버에 연결 ================

    return () => {
      socket.disconnect();
      Render.stop(render);
      World.clear(engine.world);
      Engine.clear(engine);
      render.canvas.remove();
      render.canvas = null;
      render.context = null;
    };
  }, [imagesLoaded]);

  return {};
};

export default useMatterSetupContinuity;