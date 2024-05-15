import { Engine, World, Bodies, Events, Body, Vector, Composite } from "matter-js";
import PlotTwistBox from '../Items/PlotTwistBox';
import createBox from '../Items/PlotTwistBox';

export const initializeStage2Objects = (engine, refs, isTutorialImage2End, setResultState) => {
  const { canvasSize, mouseRef, bombRef, leftArmLeftRef, rightArmRightRef } = refs;

  const walls = [
    Bodies.rectangle(canvasSize.x / 2, 0, canvasSize.x, 50, {
      isStatic: true,
      render: { sprite:{texture:'/sprite/Wall.png', yScale:0.85,xScale:0.1 }}
    }),
    Bodies.rectangle(canvasSize.x / 2, canvasSize.y, canvasSize.x, 50, {
      isStatic: true,
      render: { sprite:{texture:'/sprite/Wall.png', yScale:0.85,xScale:0.1 }}
    }),
    Bodies.rectangle(0, canvasSize.y / 2, 50, canvasSize.y, {
      isStatic: true,
      render: { sprite:{texture:'/sprite/Wall.png', yScale:0.85,xScale:0.1 }}
    }),
    Bodies.rectangle(canvasSize.x, canvasSize.y / 2, 50, canvasSize.y, {
      isStatic: true,
      render: { sprite:{texture:'/sprite/Wall.png', yScale:0.85,xScale:0.1 }}
    }),
  ];
  
  if (!isTutorialImage2End) {
    World.add(engine.world, walls);

  } else {
    let teleportLock = false;
    let onPanel = false;
    let onSlope = false;
    let onSlopeRight = false;
    //점프
    const jumping = (event, engine, ball, jumpPad) => {
        event.pairs.forEach(pair => {
            const { bodyA, bodyB } = pair;
            if ((bodyA === ball && bodyB === jumpPad) || (bodyA === jumpPad && bodyB === ball)) {
                const velocity = ball.velocity;
                Body.setVelocity(ball, { x: velocity.x, y: -velocity.y * 2 });
            }
        });
    };



    //슈퍼점프
    const superJumping = (event, engine, ball, jumpPad) => {
        event.pairs.forEach(pair => {
            const { bodyA, bodyB } = pair;
            if ((bodyA === ball && bodyB === jumpPad) || (bodyA === jumpPad && bodyB === ball)) {
                const velocity = ball.velocity;
                Body.setVelocity(ball, { x: velocity.x * 6, y: -velocity.y * 3 });
            }
        });
    };

    // 충돌 시 호출될 burnMouse 함수
    function burnMouse() {
        Body.setStatic(mouseRef, true);
    }

    //사라지는 벽
    const collapsesGround = (engine, mouse) => {
        if ((925 <= mouse.position.x && mouse.position.x <= 930 && (217 === Math.floor(mouse.position.y)))) {
            Composite.remove(engine.world, ground);
        }// x와 y 좌표를 둘 다 적어줘서 사라지게 해야함
    };

    const floors = [
        Bodies.rectangle(450, canvasSize.y - 350, 750, 25, { isStatic: true,  render: { sprite:{texture:'/sprite/Top.png', yScale:0.1,xScale:0.66 }} }),
        Bodies.rectangle(1090, canvasSize.y - 350, 330, 25, { isStatic: true, render: { sprite:{texture:'/sprite/Top.png', yScale:0.1,xScale:0.29 }} }),
        Bodies.rectangle(1473, canvasSize.y - 370, 140, 25, { isStatic: true,  render: { sprite:{texture:'/sprite/Ground4.png', yScale:0.35,xScale:0.5 } } }),
        Bodies.rectangle(800, canvasSize.y - 110, 1450, 25, { isStatic: true,  render: { sprite:{texture:'/sprite/Top.png', yScale:0.1,xScale:1.26 }}}),
    ]

    const floor = Bodies.rectangle(510, canvasSize.y - 280, 870, 25, {
        isStatic: true, render: { fillStyle: 'blue' },
        collisionFilter: {
            category: 0x0004, // category 4
            mask: 0xFFFF // 모든 category와 충돌
        },
    });

    // bombGround
    const bombGround = Bodies.rectangle(1090, canvasSize.y - 500, 100, 25, { isStatic: true, render: { fillStyle: 'purple' } });

    //사라지는바닥
    const ground = Bodies.rectangle(875, 250, 100, 25, {
        isStatic: true,
        render: {
            sprite:{
                texture:'/assets/BrokenGround_0.png',
                xScale:3,
                yScale:3.5
            }
        }
    });
    //--------------------------벽 및 바닥--------------------------

    //----------------------------region 아이템----------------------------
    //폭탄
    bombRef.current = Bodies.circle(1085, 40, 20, {
        isStatic: true,
        render: {
            fillStyle: "indigo",
        },
    });

    //좌우반전 아이템 위에서부터 차례대로
    const box1 = createBox(1530, canvasSize.y - 410, 50, 50,{
        render:{sprite:{texture:'/assets/Pointer_0.png', yScale:1,xScale:1 }}
    });
    const box2 = createBox(295, canvasSize.y - 150, 50, 50);
    const box3 = createBox(970, canvasSize.y - 387, 50, 50);
    const box4 = createBox(1295, canvasSize.y - 147, 50, 50);

    const box5 = createBox(1115, canvasSize.y - 207, 50, 50);

    //기울어진땅..?
    const panel = Bodies.rectangle(1290, canvasSize.y - 320, 140, 25, {
        isStatic: true,
        angle: Math.PI / 5, // 45도를 라디안으로 변환
        render: { fillStyle: 'blue' }
    })

    //점프대-1
    const jumpPad = Bodies.rectangle(1300, canvasSize.y - 300, 20, 20, {
        isStatic: true,
        render: {
            fillStyle: 'yellow'
        }
    });
    //점프대-2
    const jumpPad2 = Bodies.rectangle(1365, canvasSize.y - 340, 20, 20, {
        isStatic: true,
        render: {
            fillStyle: 'yellow'
        }
    });
    //슈퍼점프대-1
    const superJumppad = Bodies.rectangle(1415, canvasSize.y - 120, 20, 20, {
        isStatic: true,
        render: {
            fillStyle: 'red'
        }
    });

    //-------------------------------------------------------------
    // portal 생성
    const portal1 = Bodies.rectangle(100, 295, 25, 25, {
        isStatic: true,
        render: {
            fillStyle: "aqua",
        },
    });

    // portal 생성
    const portal2 = Bodies.rectangle(1500, 125, 25, 25, {
        isStatic: true,
        render: {
            fillStyle: "aqua",
        },
    });
    //----------------------------------------------------------------
    //----------------------------------------------------------------
    // portal 생성
    const portal3 = Bodies.rectangle(905, 300, 25, 25, {
        isStatic: true,
        render: {
            fillStyle: "white",
        },
    });

    // portal 생성
    const portal4 = Bodies.rectangle(1110, 350, 25, 25, {
        isStatic: true,
        render: {
            fillStyle: "white",
        },
    });
    //----------------------------------------------------------------

    // 불

    const fire = [
        Bodies.rectangle(230, 210, 50, 50, { isStatic: true,  render: { sprite:{texture:'/assets/Fire_0.png', yScale:1,xScale:1 } }} ),
        Bodies.rectangle(280, 210, 50, 50, { isStatic: true,  render: { sprite:{texture:'/assets/Fire_0.png', yScale:1,xScale:1 } }} ),
        Bodies.rectangle(330, 210, 50, 50, { isStatic: true,  render: { sprite:{texture:'/assets/Fire_0.png', yScale:1,xScale:1 } }} ),
        Bodies.rectangle(380, 210, 50, 50, { isStatic: true,  render: { sprite:{texture:'/assets/Fire_0.png', yScale:1,xScale:1 } }} ),
        Bodies.rectangle(430, 210, 50, 50, { isStatic: true,  render: { sprite:{texture:'/assets/Fire_0.png', yScale:1,xScale:1 } }} ),
        Bodies.rectangle(480, 210, 50, 50, { isStatic: true,  render: { sprite:{texture:'/assets/Fire_0.png', yScale:1,xScale:1 } }} ),
        
        
        Bodies.rectangle(230, 50, 50, 50, { isStatic: true,  render: { sprite:{texture:'/assets/Fire_0.png', yScale:1,xScale:1 } }} ),
        Bodies.rectangle(280, 50, 50, 50, { isStatic: true,  render: { sprite:{texture:'/assets/Fire_0.png', yScale:1,xScale:1 } }} ),
        Bodies.rectangle(330, 50, 50, 50, { isStatic: true,  render: { sprite:{texture:'/assets/Fire_0.png', yScale:1,xScale:1 } }} ),
        Bodies.rectangle(380, 50, 50, 50, { isStatic: true,  render: { sprite:{texture:'/assets/Fire_0.png', yScale:1,xScale:1 } }} ),
        Bodies.rectangle(430, 50, 50, 50, { isStatic: true,  render: { sprite:{texture:'/assets/Fire_0.png', yScale:1,xScale:1 } }} ),
        Bodies.rectangle(480, 50, 50, 50, { isStatic: true,  render: { sprite:{texture:'/assets/Fire_0.png', yScale:1,xScale:1 } }} ),
        
    ]


    // 추
    const weight = Bodies.rectangle(550, 210, 40, 40, {
        isStatic: true,
        render: {
            fillStyle: "yellow",
        },
        collisionFilter: {
            category: 0x0002, // category 2
            mask: 0xFFFF ^ 0x0001 // 모든 category와 충돌하되 category 1과는 충돌하지 않음
        }
    });
    //Body.setVelocity(weight,{x: -0.35, y:-0.3})



    //고양이버튼-1
    const catButton = Bodies.rectangle(1350, canvasSize.y - 193, 40, 10, {

        isStatic: true,
        render: {
            fillStyle: 'purple'
        }
    });
    //고양이버튼-1
    const catButton2 = Bodies.rectangle(1050, canvasSize.y - 367, 40, 10, {
        isStatic: true,
        render: {
            fillStyle: 'purple'
        }
    });

    // 고양이 생성
    const cat = Bodies.rectangle(300, canvasSize.y - 168, 200, 90, {
        isStatic: true,

    });
    //----------------------------end region 아이템----------------------------

    //------------------------------region 쥐---------------------------------
    // 쥐 생성
    mouseRef.current = Bodies.circle(220, canvasSize.y - 480, 20, {
        restitution: 0, // 반발 계수
        friction: 0.8,    // 마찰 계수
        render: {
            fillStyle: 'blue'
        },
        collisionFilter: {
            category: 0x0004, // category 4
            mask: 0xFFFF // 모든 category와 충돌
        },

    });
    //----------------------------end region 쥐-------------------------------



    //----------------내가만든기물------------------
    //정답
      //   const leftArm = Bodies.rectangle(375, canvasSize.y - 430, 330, 25, {
      //     collisionFilter: {
      //         category: 0x0001, // category 2
      //         mask: 0xFFFF ^ 0x0002 // 모든 category와 충돌하되 category 1과는 충돌하지 않음
      //     },
      //     isStatic: true,
      //     angle: Math.PI,
      //     render: {sprite:{texture:'/sprite/Ground.png', yScale:0.2,xScale:1.1} }
      // })
      leftArmLeftRef.current = Bodies.rectangle(
        canvasSize.x / 4,
        canvasSize.y / 2,
        0,
        15,
        {
          isStatic: true,
          angle: 0,
          collisionFilter: { mask: 0 },
          render: {
            fillStyle: "blue",
            strokeStyle: "black",
            lineWidth: 1,
          },
        }
      );

      //----------------내가만든기물------------------

      //---------------피어가만든기물-----------------
  
      //정답
      //  const rightArm = Bodies.rectangle(1200, canvas.y - 120, 200, 25, {
      //     isStatic: true,
      //     angle: -Math.PI / 5, // 45도를 라디안으로 변환
      //     render: { sprite:{texture:'/sprite/Ground.png', yScale:0.2,xScale:0.7} } 
      // })
      rightArmRightRef.current = Bodies.rectangle(
        canvasSize.x * 3 / 4,
        canvasSize.y / 2,
        0,
        15,
        {
          isStatic: true,
          angle: 0,
          collisionFilter: { mask: 0 },
          render: {
            fillStyle: "blue",
            strokeStyle: "black",
            lineWidth: 1,
          },
        }
      );
      //---------------피어가만든기물-----------------

    // 이미지를 순환시키기 위한 로직
    let lastUpdateTime = 0;
    let currentFrame = 0;
    Events.on(engine, "beforeUpdate", function (event) {
    const currentTime = event.timestamp;
    let frameDuration = 200; // 매 초마다 이미지 변경

    if (currentTime - lastUpdateTime > frameDuration) {
        lastUpdateTime = currentTime;
        currentFrame = (currentFrame + 1) % 6; // 0, 1, 2 순환

        box1.render.sprite.texture = `/assets/pointer_${currentFrame}.png`;
        box2.render.sprite.texture = `/assets/pointer_${currentFrame}.png`;
        jumpPad.render.sprite.texture = `/assets/jumpPad_${currentFrame}.png`;
        jumpPad2.render.sprite.texture = `/assets/jumpPad_${currentFrame}.png`;
        fire.forEach((body) => {
            body.render.sprite.texture = `/assets/fire_${currentFrame}.png`;
        });
        // fire.render.sprite.texture = `/assets/fire_${currentFrame}.png`;
        // fire1.render.sprite.texture = `/assets/fire_${currentFrame}.png`;
        // fire2.render.sprite.texture = `/assets/fire_${currentFrame}.png`;
        portal1.render.sprite.texture = `/assets/portal_${currentFrame}.png`;
        portal2.render.sprite.texture = `/assets/portal_${currentFrame}.png`;
        portal3.render.sprite.texture = `/assets/portal2_${currentFrame}.png`;
        portal4.render.sprite.texture = `/assets/portal2_${currentFrame}.png`;
        superJumppad.render.sprite.texture = `/assets/jumpPad2_${currentFrame}.png`;
        ground.render.sprite.texture = `/assets/BrokenGround_${currentFrame}.png`;
        bombGround.render.sprite.texture = `/assets/BrokenGround_${currentFrame}.png`;
        bombRef.current.render.sprite.texture = `/assets/Bomb_${currentFrame}.png`;
    }
    });


    // cheese
    const cheese = Bodies.rectangle(1300, 383, 50, 50,
        {
            isStatic: true,
            render: {
                sprite: {
                    texture: "/sprite/Cheese.png",
                    xScale: 2,
                    yScale: 2,
                  },
            },
        }
    );


    cat.render.zIndex = 5;

    // // 창을 월드에 추가
    World.add(engine.world, [...fire, ...walls, mouseRef.current,...floors, ground, jumpPad, jumpPad2, box1, box2, cheese,rightArmRightRef.current,leftArmLeftRef.current]);

      // 충돌 감지
      Events.on(engine, 'collisionStart', event => {
        handleCrasheweight(event);
        handleBurnMouse(event);
        handleTeleport(event);
        //-------------텔레포트---------
        event.pairs.forEach(pair => {
            //--------------cats--------------
            const { bodyA, bodyB } = pair;
            // mouse과 catButton이 충돌했을 때
            if ((bodyA === mouseRef.current && bodyB === catButton) || (bodyA === catButton && bodyB === mouseRef.current)) {
                //console.log("공이 고양이 버튼에 닿았습니다.");
                catButton.collisionFilter = {
                    group: 0
                }; // catButton의 충돌 필터 변경
                cat.render.fillStyle = 'red'; // cat의 색상을 빨간색으로 변경
            }
            // mouse과 catButton2이 충돌했을 때
            if ((bodyA === mouseRef.current && bodyB === catButton2) || (bodyA === catButton2 && bodyB === mouseRef.current)) {
                //console.log("공이 고양이 버튼에 닿았습니다.");
                catButton2.collisionFilter = {
                    group: 0
                }; // catButton의 충돌 필터 변경
                cat.render.fillStyle = 'red'; // cat의 색상을 빨간색으로 변경
            }
            // mouse과 cat이 충돌했을 때
            if ((bodyA === mouseRef.current && bodyB === cat) || (bodyA === cat && bodyB === mouseRef.current)) {
                // cat의 기분이 false이면 엔진을 멈추고, true이면 cat의 충돌 필터를 변경
                if (!(cat.render.fillStyle === 'red')) {
                    alert("게임오버");
                    Engine.events = {}; // 엔진 이벤트 모두 제거
                } else {
                    cat.collisionFilter = {
                        group: 0
                    };
                }
            }
            //--------------cats-------------
            //------------cheese--------------
            if ((pair.bodyA === mouseRef.current && pair.bodyB === cheese) ||
                (pair.bodyA === cheese && pair.bodyB === mouseRef.current)) {
                // mouse를 멈추고 게임 클리어를 알립니다.
                mouseRef.current.isStatic = true;
                alert("게임 클리어!");
            }
            //------------cheese--------------
            //------------leftArm------------
            // 만약 mouse가 leftArm과 충돌했다면
            if ((bodyA === mouseRef.current && (bodyB === leftArmLeftRef.current)) || ((bodyA === leftArmLeftRef.current) && bodyB === mouseRef.current)) {
                // 일정 속도를 유지하도록 설정
                onSlope = true;
            }
            //------------leftArm------------
            //------------rightArm------------
            if ((bodyA === mouseRef.current && (bodyB === rightArmRightRef.current)) || ((bodyA === rightArmRightRef.current) && bodyB === mouseRef.current)) {
                // 일정 속도를 유지하도록 설정
                onSlopeRight = true;
            }
            //------------rightArm------------
            //------------panel------------
            if ((bodyA === mouseRef.current && (bodyB === panel)) || ((bodyA === panel) && bodyB === mouseRef.current)) {
                // 일정 속도를 유지하도록 설정
                onPanel = true;
            }
            //------------panel------------

            //--------bomb--------------
            if (
                (bodyA === bombRef.current && bodyB === bombGround) ||
                (bodyA === bombGround && bodyB === bombRef.current)
            ) {
                //console.log("Collision detected between Bomb and BombGround");
                // 충돌 시 crashMouse 함수 호출
                explosion();
            }



            function explosion() {
                // Bomb가 없어지고 bombGround가 없어진다.
                World.remove(engine.world, bombRef.current);
                World.remove(engine.world, bombGround);
            }


            //--------bomb--------------

            //----------추가 바닥에 닿았을때-------------
            if ((bodyA === floor && bodyB === weight) || (bodyA === weight && bodyB === floor)) {
                weight.isStatic = true;
            }
            //----------추가 바닥에 닿았을때-------------

            //--------------좌우반전---------------
            if ((bodyA === mouseRef.current && bodyB === box1) || (bodyA === box1 && bodyB === mouseRef.current)) {
                World.remove(engine.world, [box1]); //box제거
                engine.gravity.x = engine.gravity.x * -1; //좌우반전
                //console.log("사라지는 바닥의 좌표:", mouse.position);
            }
            if ((bodyA === mouseRef.current && bodyB === box2) || (bodyA === box2 && bodyB === mouseRef.current)) {
                World.remove(engine.world, [box2]); //box제거
                engine.gravity.x = engine.gravity.x * -1; //좌우반전
                //console.log("사라지는 바닥의 좌표:", mouse.position);
            }
            if ((bodyA === mouseRef.current && bodyB === box3) || (bodyA === box3 && bodyB === mouseRef.current)) {
                World.remove(engine.world, [box3]); //box제거
                engine.gravity.x = engine.gravity.x * -1; //좌우반전
                console.log("사라지는 바닥의 좌표:", mouseRef.current.position);
            }
            if ((bodyA === mouseRef.current && bodyB === box4) || (bodyA === box4 && bodyB === mouseRef.current)) {
                World.remove(engine.world, [box4]); //box제거
                engine.gravity.x = engine.gravity.x * -1; //좌우반전
                // console.log("사라지는 바닥의 좌표:", mouse.position);
            }
            if ((bodyA === mouseRef.current && bodyB === box5) || (bodyA === box5 && bodyB === mouseRef.current)) {
                World.remove(engine.world, [box5]); //box제거
                engine.gravity.x = engine.gravity.x * -1; //좌우반전
                console.log("사라지는 바닥의 좌표:", mouseRef.current.position);
            }
            //--------------좌우반전---------------
            //--------------점프대----------------
            jumping(event, engine, mouseRef.current, jumpPad);
            jumping(event, engine, mouseRef.current, jumpPad2);
            superJumping(event, engine, mouseRef.current, superJumppad);
            //--------------점프대----------------
        });
        //불
        function handleBurnMouse(event) {
            event.pairs.forEach((pair) => {
                const { bodyA, bodyB } = pair;
                // fire 배열의 각 요소에 대해 충돌을 감지하여 게임 오버 처리
                fire.forEach((fireBody) => {
                    if ((bodyA === fireBody && bodyB === mouseRef.current) || (bodyA === mouseRef.current && bodyB === fireBody)) {
                        alert("game over");
                        burnMouse(); // 충돌 시 burnMouse 함수 호출
                    }
                });
            });
        }
        

        //추
        function handleCrasheweight(event) {
            event.pairs.forEach((pair) => {
                const { bodyA, bodyB } = pair;
                if (
                    (bodyA === weight && bodyB === mouseRef.current) ||
                    (bodyA === mouseRef.current && bodyB === weight)
                ) {
                    // 충돌 시 crashMouse 함수 호출
                    crashMouse();
                    alert("game over")
                }
            });
        }
        //마우스추에충돌시
        function crashMouse() {
            Body.setStatic(mouseRef.current, true);
        }



        //텔레포트
        function handleTeleport(event) {
            if (teleportLock) {
                //console.log("here");
                return;
            } // 잠금 상태면 순간이동 처리하지 않음

            //--------------------------portal1 & portal2--------------------------
            event.pairs.forEach((pair) => {
                const { bodyA, bodyB } = pair;
                if (
                    (teleportLock === false) && // 한 번의 충돌 이벤트에 대해서만 처리
                    (
                        (bodyA === portal2 && bodyB === mouseRef.current) ||
                        (bodyA === mouseRef.current && bodyB === portal2)
                    )
                ) {
                    Body.setPosition(mouseRef.current, {
                        x: portal1.position.x,
                        y: portal1.position.y - portal1.circleRadius - mouseRef.current.circleRadius,
                    });
                    //console.log(portal2.position.y - portal2.circleRadius - mouse.circleRadius);
                    teleportLock = true; // 포탈 사용 후 잠금
                    portal1.collisionFilter = {
                        group: 0
                    }
                    // console.log(teleportLock);
                    setTimeout(() => {
                        teleportLock = false;
                        portal1.collisionFilter = {
                            group: 1
                        }
                        //console.log("teleportLock after 5 sec", teleportLock);
                    }, 100); // 1초 후 잠금 해제
                }
            })

            event.pairs.forEach((pair) => {

                const { bodyA, bodyB } = pair;
                if (
                    (teleportLock === false) && // 한 번의 충돌 이벤트에 대해서만 처리
                    (
                        (bodyA === portal1 && bodyB === mouseRef.current) ||
                        (bodyA === mouseRef.current && bodyB === portal1)
                    )
                ) {
                    console.log("here");
                    console.log(portal1.position.x, portal1.position.y - portal1.circleRadius - mouseRef.current.circleRadius);
                    Body.setPosition(mouseRef.current, {
                        x: portal2.position.x,
                        y: portal2.position.y - portal2.circleRadius - mouseRef.current.circleRadius,
                    });
                    //console.log(portal2.position.y - portal2.circleRadius - mouse.circleRadius);
                    teleportLock = true; // 포탈 사용 후 잠금
                    portal2.collisionFilter = {
                        group: 0
                    }
                    // console.log(teleportLock);
                    setTimeout(() => {
                        teleportLock = false;
                        portal2.collisionFilter = {
                            group: 1
                        }
                        //console.log("teleportLock after 5 sec", teleportLock);
                    }, 100); // 1초 후 잠금 해제

                }
            });
            //--------------------------portal1 & portal2--------------------------

            //--------------------------portal3 & portal4--------------------------
            event.pairs.forEach((pair) => {
                const { bodyA, bodyB } = pair;
                if (
                    (teleportLock === false) && // 한 번의 충돌 이벤트에 대해서만 처리
                    (
                        (bodyA === portal4 && bodyB === mouseRef.current) ||
                        (bodyA === mouseRef.current && bodyB === portal4)
                    )
                ) {
                    Body.setPosition(mouseRef.current, {
                        x: portal3.position.x,
                        y: portal3.position.y - portal3.circleRadius - mouseRef.current.circleRadius,
                    });
                    //console.log(portal2.position.y - portal2.circleRadius - mouse.circleRadius);
                    teleportLock = true; // 포탈 사용 후 잠금
                    portal3.collisionFilter = {
                        group: 0
                    }
                    // console.log(teleportLock);
                    setTimeout(() => {
                        teleportLock = false;
                        portal3.collisionFilter = {
                            group: 1
                        }
                        //console.log("teleportLock after 5 sec", teleportLock);
                    }, 100); // 1초 후 잠금 해제
                }
            })

            event.pairs.forEach((pair) => {

                const { bodyA, bodyB } = pair;
                if (
                    (teleportLock === false) && // 한 번의 충돌 이벤트에 대해서만 처리
                    (
                        (bodyA === portal3 && bodyB === mouseRef.current) ||
                        (bodyA === mouseRef.current && bodyB === portal3)
                    )
                ) {
                    console.log("here");
                    console.log(portal3.position.x, portal3.position.y - portal3.circleRadius - mouseRef.current.circleRadius);
                    Body.setPosition(mouseRef.current, {
                        x: portal4.position.x,
                        y: portal4.position.y - portal4.circleRadius - mouseRef.current.circleRadius,
                    });
                    //console.log(portal2.position.y - portal2.circleRadius - mouse.circleRadius);
                    teleportLock = true; // 포탈 사용 후 잠금
                    portal4.collisionFilter = {
                        group: 0
                    }
                    // console.log(teleportLock);
                    setTimeout(() => {
                        teleportLock = false;
                        portal4.collisionFilter = {
                            group: 1
                        }
                        //console.log("teleportLock after 5 sec", teleportLock);
                    }, 100); // 1초 후 잠금 해제

                }
            });
            //--------------------------portal3 & portal4--------------------------
        }

    });

    Events.on(engine, 'collisionEnd', (event) => {
        const pairs = event.pairs;

        pairs.forEach((pair) => {
            const bodyA = pair.bodyA;
            const bodyB = pair.bodyB;
            //------------------------------leftArm---------------
            // 만약 mouse가 leftArm과 충돌 상태에서 벗어났다면
            if ((bodyA === mouseRef.current && bodyB === leftArmLeftRef.current) || (bodyA === leftArmLeftRef.current && bodyB === mouseRef.current)) {
                // 원래 상태로 돌아가도록 설정
                onSlope = false;
            }
            //------------------------------leftArm---------------

            //------------------------------rightArm---------------
            if ((bodyA === mouseRef.current && bodyB === rightArmRightRef.current) || (bodyA === rightArmRightRef.current && bodyB === mouseRef.current)) {
                // 원래 상태로 돌아가도록 설정
                onSlopeRight = false;
            }
            //------------------------------rightArm---------------
            //------------------------------panel---------------
            if ((bodyA === mouseRef.current && bodyB === panel) || (bodyA === panel && bodyB === mouseRef.current)) {
                // 원래 상태로 돌아가도록 설정
                onPanel = false;
            }
            //------------------------------panel---------------
        });
    });


    //----------leftArm---------
    const originalSpeedX = 0.9;
    //----------leftArm---------
    Events.on(engine, 'beforeUpdate', () => {
        // ------------사라지는 바닥------------
        collapsesGround(engine, mouseRef.current)
        //------------사라지는 바닥------------


        //---------rightArm---------
        if (onSlopeRight) {
            // 경사면에서 공이 움직이는 로직
            const angle = rightArmRightRef.current.angle;
            //console.log("angle:", angle);
            if (angle === Math.PI) {
                Body.setVelocity(mouseRef.current, mouseRef.current.velocity);
            } else {
                let modifiedAngle = angle;
                // 공이 오른쪽에서 왼쪽으로 가는 경우
                if (mouseRef.current.velocity.x < 0) {
                    if (mouseRef.current.angle > 0) {
                        modifiedAngle *= -3;
                    } else {
                        modifiedAngle *= 3; // Math.sin(angle) 값에 -3을 곱합니다.
                    }

                } else {
                    if (mouseRef.current.angle > 0) {
                        modifiedAngle *= -3;
                    } else {
                        modifiedAngle *= 3; // Math.sin(angle) 값에 -3을 곱합니다.
                    }
                }
                // 경사면의 법선 벡터 계산
                const normalVector = { x: Math.sin(modifiedAngle), y: Math.cos(angle) * 0 };
                // 경사면 방향으로 속도 설정
                const parallelComponent = Vector.mult(normalVector, originalSpeedX);
                Body.setVelocity(mouseRef.current, parallelComponent);
            }

        }
        //---------rightArm---------


        //----------leftArm---------
        if (onSlope) {
            // 경사면에서 공이 움직이는 로직
            const angle = leftArmLeftRef.current.angle;
            //console.log("leftArm angle: ", angle, "mouse velocity.x:", mouse.velocity.x)
            if (angle === Math.PI) {
                Body.setVelocity(mouseRef.current, mouseRef.current.velocity);
            } else {
                let modifiedAngle = angle;
                // 공이 오른쪽에서 왼쪽으로 가는 경우
                if (mouseRef.current.velocity.x < 0) {
                    if (mouseRef.current.angle > 0) {
                        modifiedAngle *= 3;
                    } else {
                        modifiedAngle *= -3; // Math.sin(angle) 값에 -3을 곱합니다.
                    }

                } else {
                    if (mouseRef.current.angle > 0) {
                        modifiedAngle *= -3;
                    } else {
                        modifiedAngle *= 3; // Math.sin(angle) 값에 -3을 곱합니다.
                    }
                }
                // 경사면의 법선 벡터 계산
                const normalVector = { x: Math.sin(modifiedAngle), y: Math.cos(angle) * 0 };
                // 경사면 방향으로 속도 설정
                const parallelComponent = Vector.mult(normalVector, originalSpeedX);
                Body.setVelocity(mouseRef.current, parallelComponent);
            }

        }
        //----------leftArm---------
        //----------panel---------
        if (onPanel) {
            // 경사면에서 공이 움직이는 로직
            const angle = panel.angle;
            if (angle === Math.PI) {
                Body.setVelocity(mouseRef.current, mouseRef.current.velocity);
            } else {
                let modifiedAngle = angle;
                // 공이 오른쪽에서 왼쪽으로 가는 경우
                if (mouseRef.current.velocity.x < 0) {
                    if (mouseRef.current.angle > 0) {
                        modifiedAngle *= -3;
                    } else {
                        modifiedAngle *= 3; // Math.sin(angle) 값에 -3을 곱합니다.
                    }

                } else {
                    if (mouseRef.current.angle > 0) {
                        modifiedAngle *= -3;
                    } else {
                        modifiedAngle *= 3; // Math.sin(angle) 값에 -3을 곱합니다.
                    }
                }
                // 경사면의 법선 벡터 계산
                const normalVector = { x: Math.sin(modifiedAngle), y: Math.cos(angle) * 0 };
                // 경사면 방향으로 속도 설정
                const parallelComponent = Vector.mult(normalVector, originalSpeedX);
                Body.setVelocity(mouseRef.current, parallelComponent);
            }

        }
        //----------panel---------
    });

    //-------bomb------
    setTimeout(() => {
        Body.setStatic(bombRef.current, false);
    }, 1000);
    setTimeout(() => {
        Body.setStatic(weight, false);
        Body.applyForce(weight, { x: weight.position.x, y: weight.position.y }, { x: -0.0018, y: 0 });
    }, 1000);
  //-------bomb------

    // Event handling for game goal and game over scenarios
  //   Events.on(engine, "collisionStart", (event) => {
  //     event.pairs.forEach((pair) => {
  //       if (
  //         (pair.bodyA === mouseRef.current && pair.bodyB === goal) ||
  //         (pair.bodyB === mouseRef.current && pair.bodyA === goal)
  //       ) {
  //         // 게임 클리어
  //         setResultState(0);
  //       }
  //     });
  //   });

  //   Events.on(engine, "collisionStart", (event) => {
  //     event.pairs.forEach((pair) => {
  //       if (
  //         (pair.bodyA === mouseRef.current && pair.bodyB === walls[1]) ||
  //         (pair.bodyB === mouseRef.current && pair.bodyA === walls[1])
  //       ) {
  //         // 바닥에 떨어짐
  //         setResultState(2);
  //       }
  //     });
  //   });

  //   Events.on(engine, "collisionStart", (event) => {
  //     event.pairs.forEach((pair) => {
  //       if (
  //         (pair.bodyA === mouseRef.current && pair.bodyB === bombRef.current) ||
  //         (pair.bodyB === mouseRef.current && pair.bodyA === bombRef.current)
  //       ) {
  //         // 폭탄에 닿음
  //         setResultState(3);
  //       }
  //     });
  //   });
  }
};