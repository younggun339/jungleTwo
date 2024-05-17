import { Body } from 'matter-js';

/**
 * Reset the game objects to their initial positions.
 * @param {Object} refs - The ref object containing the game objects.
 * @param {Function} setIsSimStarted - The function to set the simulation state.
 * @param {Function} setShowModal - The function to set the modal state.
 * @param {Function} setResultState - The function to set the result state.
 * @param {Function} setCountdown - The function to set the countdown state.
 */
// ================================================ STAGE 1 ====================================================
export function clearStage1Objects(
  refs,
  setIsSimStarted,
  setShowModal,
  setResultState,
  setCountdown,
) {
  console.log("clearStage1 called");
  const { mouseRef, bombRef, leftArmLeftRef, rightArmRightRef } = refs;
  
  // mouse 객체를 리셋
  Body.setVelocity(mouseRef.current, { x: 0, y: 0 });
  Body.setPosition(mouseRef.current, { x: 100, y: 100 });
  Body.setStatic(mouseRef.current, true);
  console.log(mouseRef.current);

  // bomb 객체를 리셋
  Body.setVelocity(bombRef.current, { x: 0, y: 0 });
  Body.setPosition(bombRef.current, { x: 1000, y: 100 });
  Body.setStatic(bombRef.current, true);
  Body.setAngle(bombRef.current, 0);

  // 가로 길이를 0으로 리셋
  leftArmLeftRef.current.vertices[1].x = 0;
  rightArmRightRef.current.vertices[1].x = 0;

  // 게임 상태를 리셋
  setIsSimStarted(false);
  setResultState(null);
  setShowModal(false);
  setCountdown(5);
}

// ================================================ STAGE 2 ====================================================
export function clearStage2Objects(
  refs,
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
  setIsSimStarted(false);
  setResultState(null);
  setShowModal(false);
  setCountdown(15);
}

// ================================================ STAGE 3 ====================================================
export function clearStage3Objects(
  refs,
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
  setIsSimStarted(false);
  setResultState(null);
  setShowModal(false);
  setCountdown(15);
}

// ================================================ STAGE 4 ====================================================
export function clearStage4Objects(
  refs,
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
  setIsSimStarted(false);
  setResultState(null);
  setShowModal(false);
  setCountdown(15);
}

// ================================================ STAGE 5 ====================================================
export function clearStage5Objects(
  refs,
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
  setIsSimStarted(false);
  setResultState(null);
  setShowModal(false);
  setCountdown(15);
}