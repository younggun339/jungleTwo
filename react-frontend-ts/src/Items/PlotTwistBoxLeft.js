import { Bodies } from "matter-js";

const createBoxLeft = (x, y, xs, ys) => {
  const originalHeight = 48; // 이미지 원본 높이
  const yScale = 2; // 이미지 확대 비율
  const yOffset = 1 - (originalHeight * yScale) / (2 * ys); // yOffset 추가 조정

  return Bodies.rectangle(x, y, xs, ys, {
    isStatic: true,
    render: {
      sprite: {
        texture: "/assets/Left_Pointer_0.png",
        xScale: 4,
        yScale: 3.8,
        yOffset: yOffset,
      },
    },
  });
};
export default createBoxLeft;

//how to use the plot-twist item

//좌우반전 아이템 생성할 때
/* const box = createBox(400, canvas.height - 50); */

//쥐가 'character'이고, 좌우반전 아이템이 'box' 라고할때 충돌처리
/*Events.on(engine, 'collisionStart', event => {
    event.pairs.forEach(pair => {
        const { bodyA, bodyB } = pair;
        if ((bodyA === ball && bodyB === box) || (bodyA === box && bodyB === ball)) {
            World.remove(engine.world, [box]); //box제거
            engine.gravity.x = engine.gravity.x * -1; //좌우반전
        }
    });
}); */
