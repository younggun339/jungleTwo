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

  // 충돌 필터를 리셋
  leftArmLeftRef.current.collisionFilter.mask = 0;
  rightArmRightRef.current.collisionFilter.mask = 0;
  // 가로 길이를 0으로 리셋
  leftArmLeftRef.current.vertices[1].x = 0;
  rightArmRightRef.current.vertices[1].x = 0;

  // 게임 상태를 리셋
  setIsSimStarted(false);
  setResultState(null);
  setShowModal(false);
  setCountdown(15);
  setTimeLimit(null);
}

// ================================================ STAGE 2 ====================================================
export function clearStage2Objects(
  refs,
  setIsGameStarted,
  setIsSimStarted,
  setIsTutorialImage1End,
  setIsTutorialImage2End,
  setShowModal,
  setResultState,
  setCountdown,
  setTimeLimit,
  setIsPlayerReady
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

  // 충돌 필터를 리셋
  leftArmLeftRef.current.collisionFilter.mask = 0;
  rightArmRightRef.current.collisionFilter.mask = 0;
  // 가로 길이를 0으로 리셋
  leftArmLeftRef.current.vertices[1].x = 0;
  rightArmRightRef.current.vertices[1].x = 0;

  // 게임 상태를 리셋
  setIsPlayerReady(false);
  setIsGameStarted(false);
  setIsTutorialImage1End(false);
  setIsTutorialImage2End(false);
  setIsSimStarted(false);
  setResultState(null);
  setShowModal(false);
  setCountdown(null);
  setTimeLimit(null);
}

// ================================================ STAGE 3 ====================================================
export function clearStage3Objects(
  refs,
  setIsGameStarted,
  setIsSimStarted,
  setIsTutorialImage1End,
  setIsTutorialImage2End,
  setShowModal,
  setResultState,
  setCountdown,
  setTimeLimit,
  setIsPlayerReady
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

  // 충돌 필터를 리셋
  leftArmLeftRef.current.collisionFilter.mask = 0;
  rightArmRightRef.current.collisionFilter.mask = 0;
  // 가로 길이를 0으로 리셋
  leftArmLeftRef.current.vertices[1].x = 0;
  rightArmRightRef.current.vertices[1].x = 0;

  // 게임 상태를 리셋
  setIsPlayerReady(false);
  setIsGameStarted(false);
  setIsTutorialImage1End(false);
  setIsTutorialImage2End(false);
  setIsSimStarted(false);
  setResultState(null);
  setShowModal(false);
  setCountdown(null);
  setTimeLimit(null);
}

// ================================================ STAGE 4 ====================================================
export function clearStage4Objects(
  refs,
  setIsGameStarted,
  setIsSimStarted,
  setIsTutorialImage1End,
  setIsTutorialImage2End,
  setShowModal,
  setResultState,
  setCountdown,
  setTimeLimit,
  setIsPlayerReady
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

  // 충돌 필터를 리셋
  leftArmLeftRef.current.collisionFilter.mask = 0;
  rightArmRightRef.current.collisionFilter.mask = 0;
  // 가로 길이를 0으로 리셋
  leftArmLeftRef.current.vertices[1].x = 0;
  rightArmRightRef.current.vertices[1].x = 0;

  // 게임 상태를 리셋
  setIsPlayerReady(false);
  setIsGameStarted(false);
  setIsTutorialImage1End(false);
  setIsTutorialImage2End(false);
  setIsSimStarted(false);
  setResultState(null);
  setShowModal(false);
  setCountdown(null);
  setTimeLimit(null);
}

// ================================================ STAGE 5 ====================================================
export function clearStage5Objects(
  refs,
  setIsGameStarted,
  setIsSimStarted,
  setIsTutorialImage1End,
  setIsTutorialImage2End,
  setShowModal,
  setResultState,
  setCountdown,
  setTimeLimit,
  setIsPlayerReady
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

  // 충돌 필터를 리셋
  leftArmLeftRef.current.collisionFilter.mask = 0;
  rightArmRightRef.current.collisionFilter.mask = 0;
  // 가로 길이를 0으로 리셋
  leftArmLeftRef.current.vertices[1].x = 0;
  rightArmRightRef.current.vertices[1].x = 0;

  // 게임 상태를 리셋
  setIsPlayerReady(false);
  setIsGameStarted(false);
  setIsTutorialImage1End(false);
  setIsTutorialImage2End(false);
  setIsSimStarted(false);
  setResultState(null);
  setShowModal(false);
  setCountdown(null);
  setTimeLimit(null);
}