import { useEffect, useRef } from "react";
import { Engine, Render, World } from "matter-js";
import { initializeGameObjects } from "../utils/initializeGameObjects";

const useMatterSetup = (
  canvasSize,
  sceneRef,
  engineRef,
  leftArmLeftRef,
  rightArmRightRef,
  nestjsSocketRef,
  setIsSimStarted,
  setIsGameStarted,
  setIsGoalReached,
) => {
  const mouseRef = useRef(null);
  const bombRef = useRef(null);
  
  useEffect(() => {
    const engine = engineRef.current;

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

    initializeGameObjects(
      engine,
      { canvasSize, mouseRef, bombRef, leftArmLeftRef, rightArmRightRef }
    );

    Render.run(render);

    useSimulation({
      isSimStarted,
      leftArmLeftRef,
      rightArmRightRef,
      mouseRef,
      bombRef,
      nestjsSocketRef,
      explodeBomb: () => console.log("bomb exploded"),
      winGame: () => {
        alert("game cleared");
        resetGameObjects(mouseRef, bombRef, setIsSimStarted, setIsGameStarted);
      },
      loseGame: () => {
        alert("game over");
        resetGameObjects(mouseRef, bombRef, setIsSimStarted, setIsGameStarted);
      },
    });

    return () => {
      nestjsSocketRef.current.disconnect();
      Render.stop(render);
      World.clear(engine.world);
      Engine.clear(engine);
      render.canvas.remove();
      render.canvas = null;
      render.context = null;
    };
  }, []);
};

export default useMatterSetup;
