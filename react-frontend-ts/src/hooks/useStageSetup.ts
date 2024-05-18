import { useEffect, useRef, MutableRefObject, useState } from "react";
import { Engine, Render, World, Body, Runner, Bodies, Events } from "matter-js";
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

  const renderRef = useRef<Render | null>(null);
  const [backgroundImage, setBackgroundImage] =
    useState<HTMLImageElement | null>(null); // Empty dependency array ensures this effect runs only once
  // const container = document.getElementById('matter-container');
  // if(!container) return;
  useEffect(() => {
    const engine = engineRef.current;

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
    renderRef.current = render;
    if (!engine.world) {
      console.error("World not initialized");
      return;
    }

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
    // // Event to draw the background before each render
    // Events.on(render, "beforeRender", () => {
    //   console.log("Before render.");
    //   const ctx = render.canvas.getContext("2d");
    //   if (ctx && backgroundImage) {
    //     console.log("Drawing the background.");
    //     console.log(ctx);
    //     ctx.globalCompositeOperation = "destination-over";
    //     ctx.drawImage(backgroundImage, 0, 0, canvasSize.x, canvasSize.y);
    //   } else {
    //     console.log("Context or backgroundImage is not available.");
    //   }
    // });

    // Events.on(render, "afterRender", () => {
    //   console.log("After render.");
    // });
    Render.run(render);

    return () => {
      Render.stop(render);
      World.clear(engine.world, false);
      Engine.clear(engine);
      render.canvas.remove();

      // // Cancel the animation frame request
      // stopBackgroundAnimation?.();
    };
  }, [isTutorialImage2End]);

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
