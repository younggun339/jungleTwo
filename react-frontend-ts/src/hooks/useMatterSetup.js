import { useEffect } from "react";
import { Engine, Render, World } from "matter-js";
import { initializeGameObjects } from "../utils/initializeGameObjects";

const useMatterSetup = (refs) => {
  const {
    canvasSize,
    sceneRef,
    engineRef,
    leftArmLeftRef,
    rightArmRightRef,
    mouseRef,
    bombRef,
    nestjsSocketRef
  } = refs;

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
