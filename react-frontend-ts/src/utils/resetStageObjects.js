import { Body, Events } from 'matter-js';

/**
 * Reset the game objects to their initial positions.
 * @param {Object} refs - The ref object containing the game objects.
 * @param {Function} setIsGameStarted - The function to set the game state.
 * @param {Function} setIsSimStarted - The function to set the simulation state.
 * @param {Function} setIsTutorialImage1End - The function to set the tutorial state.
 * @param {Function} setIsTutorialImage2End - The function to set the tutorial state.
 * @param {Function} setShowModal - The function to set the modal state.
 * @param {Function} setResultState - The function to set the result state.
 * @param {Function} setCountdown - The function to set the countdown state.
 * @param {Function} setIsPlayerReady - The function to set the player state.
 */
// ================================================ STAGE 1 ====================================================
export function resetStage1Objects(
  canvasSize,
  refs,
  setIsGameStarted,
  setIsSimStarted,
  setIsTutorialImage1End,
  setIsTutorialImage2End,
  setShowModal,
  setResultState,
  setCountdown,
  setIsPlayerReady
) {
  const { mouseRef, bombRef, leftArmLeftRef, rightArmRightRef, engineRef } = refs;
  Events.off(engineRef.current);

  // mouse 객체를 리셋
  Body.setVelocity(mouseRef.current, { x: 0, y: 0 });
  Body.setPosition(mouseRef.current, { x: 220, y: canvasSize.y - 480 });
  Body.setStatic(mouseRef.current, true);

  // bomb 객체를 리셋
  Body.setPosition(bombRef.current, { x: 505, y: canvasSize.y - 480 });
  Body.setStatic(bombRef.current, true);
  Body.setAngle(bombRef.current, 0);

  // 가로 길이를 0으로 리셋
  leftArmLeftRef.current.vertices[1].x = 0;
  rightArmRightRef.current.vertices[1].x = 0;

  document.getElementById("ready0").textContent = "X";
  document.getElementById("ready1").textContent = "X";

  // 게임 상태를 리셋
  setIsPlayerReady(false);
  setIsGameStarted(false);
  setIsTutorialImage1End(false);
  setIsTutorialImage2End(false);
  setIsSimStarted(false);
  setResultState(null);
  setShowModal(false);
  setCountdown(null);
}

// ================================================ STAGE 2 ====================================================
export function resetStage2Objects(
  canvasSize,
  refs,
  setIsGameStarted,
  setIsSimStarted,
  setIsTutorialImage1End,
  setIsTutorialImage2End,
  setShowModal,
  setResultState,
  setCountdown,
  setIsPlayerReady
) {
  const { mouseRef, bombRef, leftArmLeftRef, rightArmRightRef } = refs;
  
  // mouse 객체를 리셋
  Body.setVelocity(mouseRef.current, { x: 0, y: 0 });
  Body.setPosition(mouseRef.current, { x: 200, y: canvasSize.y - 480 });
  Body.setStatic(mouseRef.current, true);

  // bomb 객체를 리셋
  Body.setPosition(bombRef.current, { x: 1000, y: 100 });
  Body.setStatic(bombRef.current, true);
  Body.setAngle(bombRef.current, 0);

  // 가로 길이를 0으로 리셋
  leftArmLeftRef.current.vertices[1].x = 0;
  rightArmRightRef.current.vertices[1].x = 0;

  document.getElementById("ready0").textContent = "X";
  document.getElementById("ready1").textContent = "X";

  // 게임 상태를 리셋
  setIsPlayerReady(false);
  setIsGameStarted(false);
  setIsTutorialImage1End(false);
  setIsTutorialImage2End(false);
  setIsSimStarted(false);
  setResultState(null);
  setShowModal(false);
  setCountdown(null);
}

// ================================================ STAGE 3 ====================================================
export function resetStage3Objects(
  canvasSize,
  refs,
  setIsGameStarted,
  setIsSimStarted,
  setIsTutorialImage1End,
  setIsTutorialImage2End,
  setShowModal,
  setResultState,
  setCountdown,
  setIsPlayerReady
) {
  const { mouseRef, bombRef, leftArmLeftRef, rightArmRightRef } = refs;
  
  // mouse 객체를 리셋
  Body.setVelocity(mouseRef.current, { x: 0, y: 0 });
  Body.setPosition(mouseRef.current, { x: 200, y: canvasSize.y - 480 });
  Body.setStatic(mouseRef.current, true);

  // bomb 객체를 리셋
  Body.setPosition(bombRef.current, { x: 1000, y: 100 });
  Body.setStatic(bombRef.current, true);
  Body.setAngle(bombRef.current, 0);

  // 가로 길이를 0으로 리셋
  leftArmLeftRef.current.vertices[1].x = 0;
  rightArmRightRef.current.vertices[1].x = 0;

  document.getElementById("ready0").textContent = "X";
  document.getElementById("ready1").textContent = "X";

  // 게임 상태를 리셋
  setIsPlayerReady(false);
  setIsGameStarted(false);
  setIsTutorialImage1End(false);
  setIsTutorialImage2End(false);
  setIsSimStarted(false);
  setResultState(null);
  setShowModal(false);
  setCountdown(null);
}

// ================================================ STAGE 4 ====================================================
export function resetStage4Objects(
  canvasSize,
  refs,
  setIsGameStarted,
  setIsSimStarted,
  setIsTutorialImage1End,
  setIsTutorialImage2End,
  setShowModal,
  setResultState,
  setCountdown,
  setIsPlayerReady
) {
  const { mouseRef, bombRef, leftArmLeftRef, rightArmRightRef } = refs;
  
  // mouse 객체를 리셋
  Body.setVelocity(mouseRef.current, { x: 0, y: 0 });
  Body.setPosition(mouseRef.current, { x: 200, y: canvasSize.y - 480 });
  Body.setStatic(mouseRef.current, true);

  // bomb 객체를 리셋
  Body.setPosition(bombRef.current, { x: 1000, y: 100 });
  Body.setStatic(bombRef.current, true);
  Body.setAngle(bombRef.current, 0);

  // 가로 길이를 0으로 리셋
  leftArmLeftRef.current.vertices[1].x = 0;
  rightArmRightRef.current.vertices[1].x = 0;

  document.getElementById("ready0").textContent = "X";
  document.getElementById("ready1").textContent = "X";

  // 게임 상태를 리셋
  setIsPlayerReady(false);
  setIsGameStarted(false);
  setIsTutorialImage1End(false);
  setIsTutorialImage2End(false);
  setIsSimStarted(false);
  setResultState(null);
  setShowModal(false);
  setCountdown(null);
}

// ================================================ STAGE 5 ====================================================
export function resetStage5Objects(
  canvasSize,
  refs,
  setIsGameStarted,
  setIsSimStarted,
  setIsTutorialImage1End,
  setIsTutorialImage2End,
  setShowModal,
  setResultState,
  setCountdown,
  setIsPlayerReady
) {
  const { mouseRef, bombRef, leftArmLeftRef, rightArmRightRef } = refs;
  
  // mouse 객체를 리셋
  Body.setVelocity(mouseRef.current, { x: 0, y: 0 });
  Body.setPosition(mouseRef.current, { x: 200, y: canvasSize.y - 480 });
  Body.setStatic(mouseRef.current, true);

  // bomb 객체를 리셋
  Body.setPosition(bombRef.current, { x: 1000, y: 100 });
  Body.setStatic(bombRef.current, true);
  Body.setAngle(bombRef.current, 0);

  // 가로 길이를 0으로 리셋
  leftArmLeftRef.current.vertices[1].x = 0;
  rightArmRightRef.current.vertices[1].x = 0;

  document.getElementById("ready0").textContent = "X";
  document.getElementById("ready1").textContent = "X";

  // 게임 상태를 리셋
  setIsPlayerReady(false);
  setIsGameStarted(false);
  setIsTutorialImage1End(false);
  setIsTutorialImage2End(false);
  setIsSimStarted(false);
  setResultState(null);
  setShowModal(false);
  setCountdown(null);
}