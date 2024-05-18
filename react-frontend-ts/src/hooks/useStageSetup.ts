import { useEffect, useRef, MutableRefObject, useState } from "react";
import { Engine, Render, World, Body, Runner, Bodies, Events } from "matter-js";
import useSimulation from "./useSimulation";
import { initializeStage1Objects } from "../utils/initializeStage1Objects";
import { initializeStage2Objects } from "../utils/initializeStage2Objects";
import { initializeStage3Objects } from "../utils/initializeStage3Objects";
import { initializeStage4Objects } from "../utils/initializeStage4Objects";
import { initializeStage5Objects } from "../utils/initializeStage5Objects";
import { initializeStageObjects } from "../utils/initializeStageObjects";
import useSoundEffects from "./useSoundEffects";
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
  const playSound = useSoundEffects();
  
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
      isSimStarted,
      isTutorialImage2End,
      setResultState,
      playSound
    );

    Render.run(render);

    return () => {
      Render.stop(render);
      World.clear(engine.world, false);
      Engine.clear(engine);
      render.canvas.remove();
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

  const renderRef = useRef<Render | null>(null);
  const playSound = useSoundEffects();

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

    initializeStage2Objects(
      engine,
      {
        render,
        canvasSize,
        mouseRef,
        bombRef,
        leftArmLeftRef,
        rightArmRightRef,
      },
      isSimStarted,
      isTutorialImage2End,
      setResultState,
      playSound
    );

    Render.run(render);

    return () => {
      Render.stop(render);
      World.clear(engine.world, false);
      Engine.clear(engine);
      render.canvas.remove();
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
// ================================================ STAGE 3 ====================================================
const useStage3Setup = (
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
  const playSound = useSoundEffects();

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

    initializeStage3Objects(
      engine,
      {
        render,
        canvasSize,
        mouseRef,
        bombRef,
        leftArmLeftRef,
        rightArmRightRef,
      },
      isSimStarted,
      isTutorialImage2End,
      setResultState,
      playSound
    );

    Render.run(render);

    return () => {
      Render.stop(render);
      World.clear(engine.world, false);
      Engine.clear(engine);
      render.canvas.remove();
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

// ================================================ STAGE 4 ====================================================
const useStage4Setup = (
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
  const playSound = useSoundEffects();

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

    initializeStage4Objects(
      engine,
      {
        render,
        canvasSize,
        mouseRef,
        bombRef,
        leftArmLeftRef,
        rightArmRightRef,
      },
      isSimStarted,
      isTutorialImage2End,
      setResultState,
      playSound
    );

    Render.run(render);

    return () => {
      Render.stop(render);
      World.clear(engine.world, false);
      Engine.clear(engine);
      render.canvas.remove();
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

// ================================================ STAGE 5 ====================================================
const useStage5Setup = (
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
  const playSound = useSoundEffects();

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

    initializeStage3Objects(
      engine,
      {
        render,
        canvasSize,
        mouseRef,
        bombRef,
        leftArmLeftRef,
        rightArmRightRef,
      },
      isSimStarted,
      isTutorialImage2End,
      setResultState,
      playSound
    );

    Render.run(render);

    return () => {
      Render.stop(render);
      World.clear(engine.world, false);
      Engine.clear(engine);
      render.canvas.remove();
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

export {
  useStage1Setup,
  useStage2Setup,
  useStage3Setup,
  useStage4Setup,
  useStage5Setup,
};
export default useStage1Setup;
