import { Bodies } from 'matter-js';

const createBox = (x, y, xs, ys) => {
    return Bodies.rectangle(x, y, xs, ys, {
        isStatic: true,
        render: {
            fillStyle: 'green'
        }
    });
};

export default createBox;

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