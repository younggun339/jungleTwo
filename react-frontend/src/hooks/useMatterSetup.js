import { useEffect } from "react";
import { Engine, Render, World } from "matter-js";
import { initializeGameObjects } from "../utils/initializeGameObjects";

const useMatterSetup = (refs) => {
  const {
    canvasSize,
    sceneRef,
    videoRef,
    engineRef,
    leftArmLeftRef,
    rightHand1RightRef,
    rightHand2RightRef,
    mouseRef,
    bombRef,
    flaskSocketRef,
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
      { canvasSize, mouseRef, bombRef, leftArmLeftRef, rightHand1RightRef, rightHand2RightRef }
    );

    Render.run(render);

    return () => {
      flaskSocketRef.current.disconnect();
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
