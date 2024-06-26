import { Body, Events } from 'matter-js';
import { CanvasSize } from '../components/Game';

/**
 * Reset the game objects to their initial positions.
 * @param {CanvasSize} canvasSize - The ref object containing the game objects.
 * @param {Object} refs - The ref object containing the game objects.
 * @param {Function} setIsSimStarted - The function to set the simulation state.
 * @param {Function} setShowModal - The function to set the modal state.
 * @param {Function} setResultState - The function to set the result state.
 * @param {Function} setCountdown - The function to set the countdown state.
 */
// ================================================ STAGE 1 ====================================================
export function clearStage1Objects(
  canvasSize,
  refs,
  setIsTutorialImage1End,
  setIsTutorialImage2End,
  setIsSimStarted,
  setShowModal,
  setResultState,
  setCountdown,
) {
  const { mouseRef, bombRef, leftArmLeftRef, rightArmRightRef, engineRef } = refs;
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

  // 게임 상태를 리셋
  setIsTutorialImage1End(false);
  setIsTutorialImage2End(false);
  setIsSimStarted(false);
  setResultState(null);
  setShowModal(false);
  setCountdown(3);
}

// ================================================ STAGE 2 ====================================================
export function clearStage2Objects(
  canvasSize,
  refs,
  setIsTutorialImage1End,
  setIsTutorialImage2End,
  setIsSimStarted,
  setShowModal,
  setResultState,
  setCountdown,
) {
  const { mouseRef, bombRef, leftArmLeftRef, rightArmRightRef } = refs;
  // mouse 객체를 리셋
  Body.setVelocity(mouseRef.current, { x: 0, y: 0 });
  Body.setPosition(mouseRef.current, { x: 100, y: 100 });
  Body.setStatic(mouseRef.current, true);

  // bomb 객체를 리셋
  Body.setVelocity(bombRef.current, { x: 0, y: 0 });
  Body.setPosition(bombRef.current, { x: 1000, y: 100 });
  Body.setStatic(bombRef.current, true);
  Body.setAngle(bombRef.current, 0);

  // 가로 길이를 0으로 리셋
  leftArmLeftRef.current.vertices[1].x = 0;
  rightArmRightRef.current.vertices[1].x = 0;

  // 게임 상태를 리셋
  setIsTutorialImage1End(false);
  setIsTutorialImage2End(false);
  setIsSimStarted(false);
  setResultState(null);
  setShowModal(false);
  setCountdown(3);
}

// ================================================ STAGE 3 ====================================================
export function clearStage3Objects(
  canvasSize,
  refs,
  setIsTutorialImage1End,
  setIsTutorialImage2End,
  setIsSimStarted,
  setShowModal,
  setResultState,
  setCountdown,
) {
  const { mouseRef, bombRef, leftArmLeftRef, rightArmRightRef } = refs;
  
  // mouse 객체를 리셋
  Body.setVelocity(mouseRef.current, { x: 0, y: 0 });
  Body.setPosition(mouseRef.current, { x: 100, y: 100 });
  Body.setStatic(mouseRef.current, true);

  // bomb 객체를 리셋
  Body.setVelocity(bombRef.current, { x: 0, y: 0 });
  Body.setPosition(bombRef.current, { x: 1000, y: 100 });
  Body.setStatic(bombRef.current, true);
  Body.setAngle(bombRef.current, 0);

  // 가로 길이를 0으로 리셋
  leftArmLeftRef.current.vertices[1].x = 0;
  rightArmRightRef.current.vertices[1].x = 0;

  // 게임 상태를 리셋
  setIsTutorialImage1End(false);
  setIsTutorialImage2End(false);
  setIsSimStarted(false);
  setResultState(null);
  setShowModal(false);
  setCountdown(3);
}

// ================================================ STAGE 4 ====================================================
export function clearStage4Objects(
  canvasSize,
  refs,
  setIsTutorialImage1End,
  setIsTutorialImage2End,
  setIsSimStarted,
  setShowModal,
  setResultState,
  setCountdown,
  setTimeLimit,
) {
  const { mouseRef, bombRef, leftArmLeftRef, rightArmRightRef } = refs;
  
  // mouse 객체를 리셋
  Body.setVelocity(mouseRef.current, { x: 0, y: 0 });
  Body.setPosition(mouseRef.current, { x: 100, y: 100 });
  Body.setStatic(mouseRef.current, true);

  // bomb 객체를 리셋
  Body.setVelocity(bombRef.current, { x: 0, y: 0 });
  Body.setPosition(bombRef.current, { x: 1000, y: 100 });
  Body.setStatic(bombRef.current, true);
  Body.setAngle(bombRef.current, 0);

  // 가로 길이를 0으로 리셋
  leftArmLeftRef.current.vertices[1].x = 0;
  rightArmRightRef.current.vertices[1].x = 0;

  // 게임 상태를 리셋
  setIsTutorialImage1End(false);
  setIsTutorialImage2End(false);
  setIsSimStarted(false);
  setResultState(null);
  setShowModal(false);
  setCountdown(3);
}

// ================================================ STAGE 5 ====================================================
export function clearStage5Objects(
  canvasSize,
  refs,
  setIsTutorialImage1End,
  setIsTutorialImage2End,
  setIsSimStarted,
  setShowModal,
  setResultState,
  setCountdown,
  setTimeLimit,
) {
  const { mouseRef, bombRef, leftArmLeftRef, rightArmRightRef } = refs;
  
  // mouse 객체를 리셋
  Body.setVelocity(mouseRef.current, { x: 0, y: 0 });
  Body.setPosition(mouseRef.current, { x: 100, y: 100 });
  Body.setStatic(mouseRef.current, true);

  // bomb 객체를 리셋
  Body.setVelocity(bombRef.current, { x: 0, y: 0 });
  Body.setPosition(bombRef.current, { x: 1000, y: 100 });
  Body.setStatic(bombRef.current, true);
  Body.setAngle(bombRef.current, 0);

  // 가로 길이를 0으로 리셋
  leftArmLeftRef.current.vertices[1].x = 0;
  rightArmRightRef.current.vertices[1].x = 0;

  // 게임 상태를 리셋
  setIsTutorialImage1End(false);
  setIsTutorialImage2End(false);
  setIsSimStarted(false);
  setResultState(null);
  setShowModal(false);
  setCountdown(3);
}