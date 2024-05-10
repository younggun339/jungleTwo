import { Body, Bodies } from 'matter-js';

/**
 * Update the position, orientation, and size of a skeleton representation in Matter.js.
 * @param {Object} skeletonRef - The ref object for the skeleton body in Matter.js.
 * @param {Object} jointStart - The first joint coordinates with properties x and y.
 * @param {Object} jointEnd - The second joint tip coordinates with properties x and y.
 * @param {Object} canvasSize - The size of the canvas with properties x and y.
 */
export function updateLsideSkeleton(skeletonRef, jointStart, jointEnd, canvasSize) {
  const width = Math.sqrt(Math.pow((jointStart.x - jointEnd.x) * canvasSize.x / 2, 2) + Math.pow((jointStart.y - jointEnd.y) * canvasSize.y, 2));
  const angle = Math.atan2(jointEnd.y - jointStart.y, jointEnd.x - jointStart.x);

  // Adjust the X coordinate for right-to-left mirroring
  const centerX = canvasSize.x / 2 - ((jointStart.x + jointEnd.x) / 2) * (canvasSize.x / 2);
  const centerY = (jointStart.y + jointEnd.y) / 2 * canvasSize.y;
  const mirroredAngle = Math.PI - angle; // Angle reversal for mirroring

  // Set the position and angle of the rectangle that represents the finger
  if (skeletonRef.current) {
    Body.setPosition(skeletonRef.current, { x: centerX, y: centerY });
    Body.setAngle(skeletonRef.current, mirroredAngle);
    Body.setVertices(skeletonRef.current, Bodies.rectangle(centerX, centerY, width, 15, { angle: mirroredAngle }).vertices);
  }
}