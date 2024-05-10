import { Body } from 'matter-js';

/**
 * Reset the game objects to their initial positions.
 * @param {Object} mouseRef - The reference to the mouse object.
 * @param {Object} bombRef - The reference to the bomb object.
 * @param {Function} setIsSimStarted - The function to set the game state.
 * @param {Function} setIsGameStarted - The function to set the ingame state.
 */
export function resetGameObjects(mouseRef, bombRef, setIsSimStarted, setIsGameStarted) {
  // mouse 객체를 리셋
  Body.setPosition(mouseRef.current, { x: 100, y: 100 });

  // bomb 객체를 리셋
  Body.setPosition(bombRef.current, { x: 1000, y: 100 });
  Body.setAngle(bombRef.current, 0);

  // 게임 상태를 리셋
  setIsSimStarted(false);
  setIsGameStarted(false);
}