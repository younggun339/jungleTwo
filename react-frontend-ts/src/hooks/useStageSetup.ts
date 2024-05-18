import { useEffect, useRef, MutableRefObject } from "react";
import { Engine, Render, World, Body, Runner, Bodies } from "matter-js";
import useSimulation from "./useSimulation";
import { initializeStage1Objects } from "../utils/initializeStage1Objects";
import { initializeStage2Objects } from "../utils/initializeStage2Objects";
import { initializeStage3Objects } from "../utils/initializeStage3Objects";
import { initializeStage4Objects } from "../utils/initializeStage4Objects";
import { initializeStage5Objects } from "../utils/initializeStage5Objects";
import { initializeStageObjects } from "../utils/initializeStageObjects";

interface CanvasSize {
  x: number;
  y: number;
}

// ================================================ STAGE 1 ====================================================
const useStage1Setup = (
  canvasSize: CanvasSize,
  sceneRef: MutableRefObject<HTMLDivElement | null>,
  isSimStarted: boolean,
  isTutorialImage2End: boolean,
  setResultState: (value: number) => void
) => {
  const engineRef = useRef<Engine>(Engine.create());

  const leftArmLeftRef = useRef<Body | null>(null);
  const rightArmRightRef = useRef<Body | null>(null);
  const mouseRef = useRef<Body | null>(null);
  const bombRef = useRef<Body | null>(null);

  // const container = document.getElementById('matter-container');
  // if(!container) return;
  useEffect(() => {
    const engine = engineRef.current;

    // // Ensure the container is correctly referenced
    // if (!sceneRef.current) {
    //   console.error("No scene container found");
    //   return;
    // }

    const render = Render.create({
      element: document.getElementById("matter-container") as HTMLElement,
      engine: engine,
      options: {
        width: canvasSize.x,
        height: canvasSize.y,
        wireframes: false,
        background: "transparent", // Set canvas background to transparent
      },
    });

    if (!engine.world) {
      console.error("World not initialized");
      return;
    }
    // // Function to draw the animated background
    // // Function to draw the animated background
    // function drawBackground(
    //   ctx: CanvasRenderingContext2D,
    //   width: number,
    //   height: number,
    //   tick: number
    // ) {
    //   const opacity = 0.5 + 0.5 * Math.sin(tick / 60);
    //   ctx.fillStyle = `rgba(150, 150, 255, ${opacity})`;
    //   ctx.fillRect(0, 0, width, height);
    // }

    // // Start the animation
    // function startBackgroundAnimation() {
    //   const ctx = render.canvas.getContext("2d");
    //   if (!ctx) {
    //     console.error("Failed to get 2D context");
    //     return;
    //   }

    //   const width = render.canvas.width;
    //   const height = render.canvas.height;

    //   // Initial draw to prevent flickering
    //   drawBackground(ctx, width, height, performance.now());

    //   // Variable to hold the animation frame request
    //   let frameId: number;

    //   // The animate function
    //   function animate() {
    //     frameId = requestAnimationFrame(animate);

    //     // Ensure ctx is not null before drawing
    //     if (ctx !== null) {
    //       // Clear the canvas
    //       ctx.clearRect(0, 0, width, height);

    //       // Draw the background first
    //       drawBackground(ctx, width, height, performance.now());
    //     }
    //   }

    //   animate();

    //   return () => {
    //     cancelAnimationFrame(frameId);
    //   };
    // }
    // Start the Matter.js renderer

    initializeStage1Objects(
      engine,
      {
        render,
        canvasSize,
        mouseRef,
        bombRef,
        leftArmLeftRef,
        rightArmRightRef,
      },
      isTutorialImage2End,
      setResultState
    );

    // const stopBackgroundAnimation = startBackgroundAnimation();

    Render.run(render);

    return () => {
      Render.stop(render);
      World.clear(engine.world, false);
      Engine.clear(engine);
      render.canvas.remove();

      // // Cancel the animation frame request
      // stopBackgroundAnimation?.();
    };
  }, [canvasSize, isTutorialImage2End]);

  useSimulation({
    isSimStarted,
    leftArmLeftRef,
    rightArmRightRef,
    mouseRef,
    bombRef,
    engineRef,
  });

  return { mouseRef, bombRef, leftArmLeftRef, rightArmRightRef };
};

// ================================================ STAGE 2 ====================================================
const useStage2Setup = (
  canvasSize: CanvasSize,
  sceneRef: MutableRefObject<HTMLDivElement | null>,
  isSimStarted: boolean,
  isTutorialImage2End: boolean,
  setResultState: (value: number) => void
) => {
  const engineRef = useRef<Engine>(Engine.create());

  const leftArmLeftRef = useRef<Body | null>(null);
  const rightArmRightRef = useRef<Body | null>(null);
  const mouseRef = useRef<Body | null>(null);
  const bombRef = useRef<Body | null>(null);

  useEffect(() => {
    console.log("stage2 setup useEffect called");
    const engine = engineRef.current;

    const render = Render.create({
      element: document.getElementById("matter-container") as HTMLElement,
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

    initializeStage2Objects(
      engine,
      { canvasSize, mouseRef, bombRef, leftArmLeftRef, rightArmRightRef },
      isTutorialImage2End,
      setResultState
    );

    Render.run(render);

    return () => {
      Render.stop(render);
      World.clear(engine.world, false);
      Engine.clear(engine);
      render.canvas.remove();
    };
  }, [isTutorialImage2End, isSimStarted]);

  useSimulation({
    isSimStarted,
    leftArmLeftRef,
    rightArmRightRef,
    mouseRef,
    bombRef,
    engineRef,
  });

  return { mouseRef, bombRef, leftArmLeftRef, rightArmRightRef };
};

// ================================================ STAGE 3 ====================================================
const useStage3Setup = (
  canvasSize: CanvasSize,
  sceneRef: MutableRefObject<HTMLDivElement | null>,
  isSimStarted: boolean,
  isTutorialImage2End: boolean,
  setResultState: (value: number) => void
) => {
  const engineRef = useRef<Engine>(Engine.create());
  const runner = Runner.create();

  const leftArmLeftRef = useRef<Body | null>(null);
  const rightArmRightRef = useRef<Body | null>(null);
  const mouseRef = useRef<Body | null>(null);
  const bombRef = useRef<Body | null>(null);

  useEffect(() => {
    console.log("stage3 setup useEffect called");
    const engine = engineRef.current;

    const render = Render.create({
      element: document.getElementById("matter-container") as HTMLElement,
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

    initializeStage3Objects(
      engine,
      { canvasSize, mouseRef, bombRef, leftArmLeftRef, rightArmRightRef },
      isTutorialImage2End,
      setResultState
    );

    Render.run(render);
    Runner.run(runner, engine);

    return () => {
      Render.stop(render);
      World.clear(engine.world, false);
      Engine.clear(engine);
      Runner.stop(runner);
      render.canvas.remove();
    };
  }, [isTutorialImage2End, isSimStarted]);

  useSimulation({
    isSimStarted,
    leftArmLeftRef,
    rightArmRightRef,
    mouseRef,
    bombRef,
    engineRef,
  });

  return { mouseRef, bombRef, leftArmLeftRef, rightArmRightRef };
};

// ================================================ STAGE 4 ====================================================
const useStage4Setup = (
  canvasSize: CanvasSize,
  sceneRef: MutableRefObject<HTMLDivElement | null>,
  isSimStarted: boolean,
  isTutorialImage2End: boolean,
  setResultState: (value: number) => void
) => {
  const engineRef = useRef<Engine>(Engine.create());
  const runner = Runner.create();

  const leftArmLeftRef = useRef<Body | null>(null);
  const rightArmRightRef = useRef<Body | null>(null);
  const mouseRef = useRef<Body | null>(null);
  const bombRef = useRef<Body | null>(null);

  useEffect(() => {
    console.log("stage4 setup useEffect called");
    const engine = engineRef.current;

    const render = Render.create({
      element: document.getElementById("matter-container") as HTMLElement,
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

    initializeStage4Objects(
      engine,
      { canvasSize, mouseRef, bombRef, leftArmLeftRef, rightArmRightRef },
      isTutorialImage2End,
      setResultState
    );

    Render.run(render);
    Runner.run(runner, engine);

    return () => {
      Render.stop(render);
      World.clear(engine.world, false);
      Engine.clear(engine);
      Runner.stop(runner);
      render.canvas.remove();
    };
  }, [isTutorialImage2End, isSimStarted]);

  useSimulation({
    isSimStarted,
    leftArmLeftRef,
    rightArmRightRef,
    mouseRef,
    bombRef,
    engineRef,
  });

  return { mouseRef, bombRef, leftArmLeftRef, rightArmRightRef };
};

// ================================================ STAGE 5 ====================================================
const useStage5Setup = (
  canvasSize: CanvasSize,
  sceneRef: MutableRefObject<HTMLDivElement | null>,
  isSimStarted: boolean,
  isTutorialImage2End: boolean,
  setResultState: (value: number) => void
) => {
  const engineRef = useRef<Engine>(Engine.create());
  const runner = Runner.create();

  const leftArmLeftRef = useRef<Body | null>(null);
  const rightArmRightRef = useRef<Body | null>(null);
  const mouseRef = useRef<Body | null>(null);
  const bombRef = useRef<Body | null>(null);

  useEffect(() => {
    console.log("stage5 setup useEffect called");
    const engine = engineRef.current;

    const render = Render.create({
      element: document.getElementById("matter-container") as HTMLElement,
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

    initializeStage5Objects(
      engine,
      { canvasSize, mouseRef, bombRef, leftArmLeftRef, rightArmRightRef },
      isTutorialImage2End,
      setResultState
    );

    Render.run(render);
    Runner.run(runner, engine);

    return () => {
      Render.stop(render);
      World.clear(engine.world, false);
      Engine.clear(engine);
      Runner.stop(runner);
      render.canvas.remove();
    };
  }, [isTutorialImage2End, isSimStarted]);

  useSimulation({
    isSimStarted,
    leftArmLeftRef,
    rightArmRightRef,
    mouseRef,
    bombRef,
    engineRef,
  });

  return { mouseRef, bombRef, leftArmLeftRef, rightArmRightRef };
};

export {
  useStage1Setup,
  useStage2Setup,
  useStage3Setup,
  useStage4Setup,
  useStage5Setup,
};
export default useStage1Setup;
