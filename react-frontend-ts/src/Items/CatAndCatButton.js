import React from 'react';
import Matter, { Bodies } from 'matter-js';

const Cat = (x, y, mood) => {
    return Bodies.rectangle(x, y, 60, 30, {
        isStatic: true,
        render: {
            fillStyle: 'green'
        }
    });
};

const CatButton = (x, y) => {
    return Bodies.rectangle(x, y, 60, 10, {
        isStatic: true,
        render: {
            fillStyle: 'purple'
        }
    });
};

export { Cat, CatButton };

//how to use the cat and catButton item

//생성할 때
// const cat = Cat(600, canvas.height - 30, catMood);
// const catButton = CatButton(400, canvas.height - 25);

//충돌처리
// Events.on(engine, 'collisionStart', event => {
//     event.pairs.forEach(pair => {
//         const { bodyA, bodyB } = pair;
//         // ball과 catButton이 충돌했을 때
//         if ((bodyA === ball && bodyB === catButton) || (bodyA === catButton && bodyB === ball)) {
//             console.log("공이 고양이 버튼에 닿았습니다.");
//             catButton.collisionFilter = {
//                 group: 0
//             }; // catButton의 충돌 필터 변경
//             cat.render.fillStyle = 'red'; // cat의 색상을 빨간색으로 변경
//         }
//         // ball과 cat이 충돌했을 때
//         if ((bodyA === ball && bodyB === cat) || (bodyA === cat && bodyB === ball)) {
//             // cat의 기분이 false이면 엔진을 멈추고, true이면 cat의 충돌 필터를 변경
//             if (!(cat.render.fillStyle === 'red')) {
//                 console.log("게임오버");
//                 Engine.events = {}; // 엔진 이벤트 모두 제거
//             } else {
//                 cat.collisionFilter = {
//                     group: 0
//                 };
//             }
//         }
//     });
// });
