import { useEffect, useRef, MutableRefObject } from "react";
import { Engine, Render, World, Body, Runner } from "matter-js";
import useSimulation from "./useSimulation";
import { initializeStage1Objects } from "../utils/initializeStage1Objects";
import { initializeStage2Objects } from "../utils/initializeStage2Objects";
import { initializeStage3Objects } from "../utils/initializeStage3Objects";
import { initializeStage4Objects } from "../utils/initializeStage4Objects";
import { initializeStage5Objects } from "../utils/initializeStage5Objects";

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
  const runner = Runner.create();

  const leftArmLeftRef = useRef<Body | null>(null);
  const rightArmRightRef = useRef<Body | null>(null);
  const mouseRef = useRef<Body | null>(null);
  const bombRef = useRef<Body | null>(null);

  useEffect(() => {
    const engine = engineRef.current;
    if (isSimStarted) {
      engine.world.gravity.y = 0.15;
      engine.world.gravity.x = 0.04;
      engine.timing.timeScale = 2;
    }

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

    initializeStage1Objects(
      engine,
      { render, canvasSize, mouseRef, bombRef, leftArmLeftRef, rightArmRightRef },
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

// ================================================ STAGE 2 ====================================================
const useStage2Setup = (
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
    const engine = engineRef.current;
    if (isSimStarted) {
      engine.world.gravity.y = 0.15;
      engine.world.gravity.x = 0.04;
      engine.timing.timeScale = 3;
    }

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
    const engine = engineRef.current;
    if (isSimStarted) {
      engine.world.gravity.y = 0.15;
      engine.world.gravity.x = 0.04;
      engine.timing.timeScale = 3;
    }

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
    const engine = engineRef.current;
    if (isSimStarted) {
      engine.world.gravity.y = 0.15;
      engine.world.gravity.x = 0.04;
      engine.timing.timeScale = 3;
    }

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
    const engine = engineRef.current;
    if (isSimStarted) {
      engine.world.gravity.y = 0.15;
      engine.world.gravity.x = 0.04;
      engine.timing.timeScale = 3;
    }

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
