import Matter, {
  Engine,
  World,
  Bodies,
  Events,
  Body,
  Vector,
  Composite,
  Render,
} from "matter-js";
import PlotTwistBox from "../Items/PlotTwistBox";
import createBox from "../Items/PlotTwistBox";
import createBoxLeft from "../Items/PlotTwistBoxLeft";

class SoundManager {
  constructor() {
    this.sounds = {};
  }

  loadSound(name, filePath) {
    const audio = new Audio(filePath);
    audio.load();
    this.sounds[name] = audio;
  }

  playSound(name) {
    const audio = this.sounds[name];
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    } else {
      console.error(`Sound ${name} not found`);
    }
  }
}

const soundManager = new SoundManager();

soundManager.loadSound('superJump', '/sound/SuperJump.wav');
soundManager.loadSound('jump', '/sound/Jump.wav');

export const initializeStage4Objects = (
  engine,
  refs,
  isSimStarted,
  isTutorialImage2End,
  isRightPointer,
  setResultState,
  playSound,
  setIsRightPointer
) => {
  const {
    render,
    canvasSize,
    mouseRef,
    bombRef,
    leftArmLeftRef,
    rightArmRightRef,
  } = refs;

  const walls = [
    Bodies.rectangle(0, canvasSize.y / 2, 50, canvasSize.y, {
      isStatic: true,
      render: {
        sprite: { texture: "/sprite/Wall.png", yScale: 0.85, xScale: 0.1 },
      },
    }),
    Bodies.rectangle(canvasSize.x, canvasSize.y / 2, 50, canvasSize.y, {
      isStatic: true,
      render: {
        sprite: { texture: "/sprite/Wall.png", yScale: 0.85, xScale: 0.1 },
      },
    }),
  ];

  if (!isTutorialImage2End) {
    if (engine) {
      Engine.clear(engine);
    }
    Events.off(engine);
    setIsRightPointer(false);

    World.add(engine.world, walls);
    console.log("isTutorialImage2End", isTutorialImage2End);
  } else {
    if (engine) {
      Engine.clear(engine);
    }
    Events.off(engine);
    setIsRightPointer(false);

    console.log("!isTutorialImage2End", isTutorialImage2End);
    let teleportLock = false;
    let onPanel = false;
    let onSlope = false;
    let onSlopeRight = false;
    //점프


    const jumping = (event, engine, ball, jumpPad) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        if (
          (bodyA === ball && bodyB === jumpPad) ||
          (bodyA === jumpPad && bodyB === ball)
        ) {
          soundManager.playSound('jump');
          const velocity = ball.velocity;
          Body.setVelocity(ball, { x: velocity.x, y: -velocity.y * 2.2 });
        }
      });
    };

    //슈퍼점프
    const superJumping = (event, engine, ball, jumpPad) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        if (
          (bodyA === ball && bodyB === jumpPad) ||
          (bodyA === jumpPad && bodyB === ball)
        ) {
          soundManager.playSound('superJump');
          const velocity = ball.velocity;
          Body.setVelocity(ball, { x: velocity.x * 4, y: -velocity.y * 3 });
        }
      });
    };

    // 충돌 시 호출될 burnMouse 함수
    function burnMouse() {
      playSound("/sound/Burn.wav");
      playSound("/sound/GameOver.wav");
      Body.setStatic(mouseRef.current, true);
    }

    //사라지는 바닥
    const collapsesGround = () => {
      if (
        740 <= mouseRef.current.position.x &&
        mouseRef.current.position.x <= 755 &&
        117 === Math.floor(mouseRef.current.position.y)
      ) {
        playSound("/sound/BrokenGround.wav");
        Composite.remove(engine.world, ground);
      } // x와 y 좌표를 둘 다 적어줘서 사라지게 해야함
    };

    // 쥐가 낙사 시 죽는 이벤트를 걸기 위한 바닥 생성
    const fallFloor = Bodies.rectangle(
      canvasSize.x / 2,
      canvasSize.y + 50,
      canvasSize.x,
      1,
      {
        isStatic: true,
        render: {
          fillStyle: "red",
        },
      }
    );

    const floors = [
      Bodies.rectangle(200, canvasSize.y - 450, 300, 25, {
        label: "load",
        isStatic: true,
        render: {
          sprite: { texture: "/sprite/Top.png", yScale: 0.1, xScale: 0.26 },
        },
      }),
      Bodies.rectangle(600, canvasSize.y - 450, 100, 25, {
        label: "load",
        isStatic: true,
        render: {
          sprite: {
            texture: "/sprite/Ground4.png",
            yScale: 0.35,
            xScale: 0.41,
          },
        },
      }),
      Bodies.rectangle(800, canvasSize.y - 450, 100, 25, {
        label: "load",
        isStatic: true,
        render: {
          sprite: {
            texture: "/sprite/Ground4.png",
            yScale: 0.35,
            xScale: 0.41,
          },
        },
      }),

      Bodies.rectangle(200, canvasSize.y - 280, 300, 25, {
        label: "load",
        isStatic: true,
        render: {
          sprite: { texture: "/sprite/Top.png", yScale: 0.1, xScale: 0.26 },
        },
      }),
      Bodies.rectangle(700, canvasSize.y - 280, 300, 25, {
        label: "load",
        isStatic: true,
        render: {
          sprite: { texture: "/sprite/Top.png", yScale: 0.1, xScale: 0.26 },
        },
      }),

      Bodies.rectangle(200, canvasSize.y - 110, 300, 25, {
        label: "load",
        isStatic: true,
        render: {
          sprite: { texture: "/sprite/Top.png", yScale: 0.1, xScale: 0.26 },
        },
      }),
      Bodies.rectangle(700, canvasSize.y - 110, 300, 25, {
        label: "load",
        isStatic: true,
        render: {
          sprite: { texture: "/sprite/Top.png", yScale: 0.1, xScale: 0.26 },
        },
      }),

      Bodies.rectangle(1300, canvasSize.y - 110, 350, 25, {
        label: "load",
        isStatic: true,
        render: {
          sprite: { texture: "/sprite/Top.png", yScale: 0.1, xScale: 0.26 },
        },
      }),
      Bodies.rectangle(1100, canvasSize.y - 400, 200, 25, {
        label: "load",
        isStatic: true,
        render: {
          sprite: { texture: "/sprite/Top.png", yScale: 0.1, xScale: 0.18 },
        },
      }),
    ];

    const floor = Bodies.rectangle(510, canvasSize.y - 280, 870, 25, {
      isStatic: true,
      render: { fillStyle: "blue" },
      collisionFilter: {
        category: 0x0004, // category 4
        mask: 0xffff, // 모든 category와 충돌
      },
    });

    // bombGround
    const bombGround = Bodies.rectangle(1250, canvasSize.y - 400, 100, 25, {
      isStatic: true,
      render: {
        sprite: {
          texture: "/assets/BrokenGround_0.png",
          xScale: 3,
          yScale: 3.5,
        },
      },
    });

    //사라지는바닥
    const ground = Bodies.rectangle(700, 150, 100, 25, {
      label: "load",
      isStatic: true,
      render: {
        sprite: {
          texture: "/assets/BrokenGround_0.png",
          xScale: 3,
          yScale: 3.5,
        },
      },
    });
    //--------------------------벽 및 바닥--------------------------

    //----------------------------region 아이템----------------------------
    //폭탄
    bombRef.current = Bodies.circle(1255, 40, 20, {
      frictionAir: Number.MIN_VALUE,
      isStatic: true,
      render: {
        sprite: {
          texture: "/assets/Bomb_0.png",
          xScale: 2.5,
          yScale: 2.5,
        },
      },
    });

    //좌우반전 아이템 위에서부터 차례대로
    const box1 = createBoxLeft(840, canvasSize.y - 487, 50, 50);
    const box2 = createBox(600, canvasSize.y - 317, 50, 50);
    const box3 = createBox(200, canvasSize.y - 317, 50, 50);
    const box4 = createBoxLeft(840, canvasSize.y - 147, 50, 50);

    const box5 = createBox(1115, canvasSize.y - 207, 50, 50);

    //기울어진땅..?
    const panel = Bodies.rectangle(1290, canvasSize.y - 320, 140, 25, {
      isStatic: true,
      angle: Math.PI / 5, // 45도를 라디안으로 변환
      render: { fillStyle: "blue" },
    });

    //점프대-1
    const jumpPad = Bodies.rectangle(900, canvasSize.y - 220, 20, 20, {
      isStatic: true,
      render: {
        sprite: {
          texture: "/assets/JumpPad_4.png",
        },
      },
    });
    //점프대-2
    const jumpPad2 = Bodies.rectangle(1353, canvasSize.y - 100, 20, 20, {
      isStatic: true,
      render: {
        sprite: {
          texture: "/assets/JumpPad_4.png",
        },
      },
    });
    //슈퍼점프대-1
    const superJumppad = Bodies.rectangle(940, canvasSize.y - 30, 20, 20, {
      isStatic: true,
      render: {
        sprite: {
          texture: "/assets/JumpPad2_4.png",
        },
      },
    });
    //슈퍼점프대-1
    // const superJumppad2 = Bodies.rectangle(1353, canvasSize.y - 30, 20, 20, {
    //   isStatic: true,
    //   render: {
    //     sprite: {
    //       texture: "/assets/JumpPad2_4.png",
    //     },
    //   },
    // });

    //-------------------------------------------------------------
    // portal 생성
    const portal1 = Bodies.rectangle(1450, 450, 25, 25, {
      isStatic: true,
      render: {
        sprite: {
          texture: "/assets/Portal_0.png",
          xScale: 0.35,
          yScale: 0.35,
        },
      },
    });

    // portal 생성
    const portal2 = Bodies.rectangle(1000, 55, 25, 25, {
      isStatic: true,
      render: {
        sprite: {
          texture: "/assets/Portal_0.png",
          xScale: 0.35,
          yScale: 0.35,
        },
      },
    });
    //----------------------------------------------------------------
    //----------------------------------------------------------------
    // portal 생성
    const portal3 = Bodies.rectangle(905, 300, 25, 25, {
      isStatic: true,
      render: {
        sprite: {
          texture: "/assets/Portal2_0.png",
        },
      },
    });

    // portal 생성
    const portal4 = Bodies.rectangle(1110, 350, 25, 25, {
      isStatic: true,
      render: {
        sprite: {
          texture: "/assets/Portal2_0.png",
        },
      },
    });
    //----------------------------------------------------------------

    // 불
    const fire = Bodies.rectangle(1355, 453, 50, 50, {
      isStatic: true,
      render: {
        fillStyle: "red",
      },
    });

    //불1
    const fire1 = Bodies.rectangle(1250, 405, 50, 50, {
      isStatic: true,
      render: {
        fillStyle: "red",
      },
    });

    //불2
    // const fire2 = Bodies.rectangle(1500, 63, 50, 50,
    //     {
    //         isStatic: true,
    //         render: {
    //             fillStyle: "red",
    //         },
    //     }
    // );

    //불3
    const fire2 = Bodies.rectangle(1480, 283, 50, 50, {
      isStatic: true,
      render: {
        fillStyle: "red",
      },
    });

    // 추
    const weight = Bodies.rectangle(550, 210, 40, 40, {
      isStatic: true,
      render: {
        fillStyle: "yellow",
      },
      collisionFilter: {
        category: 0x0002, // category 2
        mask: 0xffff ^ 0x0001, // 모든 category와 충돌하되 category 1과는 충돌하지 않음
      },
    });
    //Body.setVelocity(weight,{x: -0.35, y:-0.3})

    //고양이버튼-1
    const catButton = Bodies.rectangle(330, canvasSize.y - 467, 40, 10, {
      isStatic: true,
      render: {
        sprite: {
          texture: "/assets/CatButton.png",
          xScale: 0.05,
          yScale: 0.05,
        },
      },
    });
    //고양이버튼-1
    const catButton2 = Bodies.rectangle(1050, canvasSize.y - 367, 40, 10, {
      isStatic: true,
      render: {
        sprite: {
          texture: "/assets/CatButton.png",
          xScale: 0.05,
          yScale: 0.05,
        },
      },
    });

    // 고양이 생성
    const cat = Bodies.rectangle(200, canvasSize.y - 168, 200, 90, {
      isStatic: true,
      render: {
        sprite: {
          texture: "/assets/CatOpen.png",
          xScale: 0.17,
          yScale: 0.17,
        },
      },
    });
    //----------------------------end region 아이템----------------------------

    //------------------------------region 쥐---------------------------------
    // 쥐 생성
    mouseRef.current = Bodies.circle(200, canvasSize.y - 480, 20, {
      restitution: 0, // 반발 계수
      friction: 0.8, // 마찰 계수
      frictionAir: Number.MIN_VALUE,
      render: {
        fillStyle: "transparent",
        strokeStyle: "transparent",
      },
      collisionFilter: {
        category: 0x0004, // 충돌 그룹 설정
        mask: 0xffff, // 다른 모든 그룹과 충돌하도록 설정
      },
    });
    const mouseImagesRight = [
      "/assets/RatWalkRight_0.png",
      // "/assets/RatWalkRight_1.png",
      // "/assets/RatWalkRight_2.png",
      "/assets/RatWalkRight_3.png",
      // "/assets/RatWalkRight_4.png",
      // "/assets/RatWalkRight_5.png",
      "/assets/RatWalkRight_6.png",
      // "/assets/RatWalkRight_7.png",
      // "/assets/RatWalkRight_8.png",
    ];

    const mouseImagesLeft = [
      "/assets/RatWalkLeft_0.png",
      // "/assets/RatWalkLeft_1.png",
      // "/assets/RatWalkLeft_2.png",
      "/assets/RatWalkLeft_3.png",
      // "/assets/RatWalkLeft_4.png",
      // "/assets/RatWalkLeft_5.png",
      "/assets/RatWalkLeft_6.png",
      // "/assets/RatWalkLeft_7.png",
      // "/assets/RatWalkLeft_8.png",
    ];

    // 죽은 쥐 이미지 배열
    const mouseImagesDead = [
      "/assets/RatDead_0.png",
      "/assets/RatDead_1.png",
      "/assets/RatDead_2.png",
      "/assets/RatDead_3.png",
    ];

    let currentImageIndex = 0;
    let mouseIsDead = false; // 쥐의 상태를 추적하는 변수

    // 매초마다 이미지를 변경하는 로직
    const intervalId = setInterval(() => {
      if (!mouseIsDead) {
        currentImageIndex = (currentImageIndex + 1) % mouseImagesRight.length; // 살아있는 쥐 이미지 순환
      } else {
        // 죽은 쥐 이미지가 한 번만 순환하도록 처리
        if (currentImageIndex < mouseImagesDead.length - 1) {
          currentImageIndex++;
        }
      }
    }, 400);

    // 너비를 조정할 스케일 팩터
    const widthScaleFactor = 3; // 너비를 조정하는 스케일 팩터
    const heightScaleFactor = 2; // 높이를 조정하는 스케일 팩터, 원하는 값으로 설정하세요.

    // 커스텀 렌더링 함수
    function handleMouseRender(event) {
      const context = render.context;
      const bodies = Matter.Composite.allBodies(engine.world);

      for (let body of bodies) {
        if (body.circleRadius) {
          const { x, y } = body.position;
          const img = new Image();

          // bombRef.current 예외 처리
          if (body === bombRef.current) {
            continue; // 이 라인은 폭탄 객체에 대해 아무 작업도 하지 않음
          }

          // 쥐의 상태에 따라 이미지 배열 선택
          let mouseImages;
          if (!mouseIsDead) {
            mouseImages =
              body.velocity.x >= 0 ? mouseImagesRight : mouseImagesLeft;
          } else {
            mouseImages = mouseImagesDead;
          }

          img.src = mouseImages[currentImageIndex];

          // 너비와 높이를 스케일 팩터로 조정
          const scaledWidth = body.circleRadius * 2 * widthScaleFactor;
          const scaledHeight = body.circleRadius * 2 * heightScaleFactor;

          context.save();
          context.translate(x, y);
          context.drawImage(
            img,
            -scaledWidth / 2,
            -scaledHeight / 2,
            scaledWidth,
            scaledHeight
          );
          context.restore();
        }
      }
    }
    // Matter.js의 렌더링 이벤트에 커스텀 렌더링 함수를 연결합니다.
    Events.on(render, "afterRender", handleMouseRender);

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
          fillStyle: "yellow",
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
      (canvasSize.x * 3) / 4,
      canvasSize.y / 2,
      0,
      15,
      {
        isStatic: true,
        angle: 0,
        collisionFilter: { mask: 0 },
        render: {
          fillStyle: "yellow",
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
      let frameDuration = 100; // 매 초마다 이미지 변경

      if (currentTime - lastUpdateTime > frameDuration) {
        lastUpdateTime = currentTime;
        currentFrame = (currentFrame + 1) % 6; // 0, 1, 2 순환

        // 각 이미지를 로드한 후에만 이미지 변경
        loadImage(`/assets/JumpPad_${currentFrame}.png`, function () {
          jumpPad.render.sprite.texture = `/assets/JumpPad_${currentFrame}.png`;
          jumpPad2.render.sprite.texture = `/assets/JumpPad_${currentFrame}.png`;
        });
        // 이하 동일
        loadImage(`/assets/JumpPad2_${currentFrame}.png`, function () {
          superJumppad.render.sprite.texture = `/assets/JumpPad2_${currentFrame}.png`;
          // superJumppad2.render.sprite.texture = `/assets/JumpPad2_${currentFrame}.png`;
        });
      }
    });

    // 이미지 로드 함수 정의
    function loadImage(url, callback) {
      const img = new Image();
      img.onload = function () {
        callback();
      };
      img.src = url;
    }

    // cheese
    const cheese = Bodies.rectangle(1500, 253, 50, 50, {
      isStatic: true,
      render: {
        sprite: {
          texture: "/sprite/Cheese.png",
          xScale: 2,
          yScale: 2,
        },
      },
    });

    cat.render.zIndex = 5;

    // // 창을 월드에 추가
    World.add(engine.world, [
      ...floors,
      cheese,
      bombRef.current,
      bombGround,
      portal1,
      portal2,
      mouseRef.current,
      rightArmRightRef.current,
      leftArmLeftRef.current,
      superJumppad,
      // superJumppad2,
      jumpPad,
      box1,
      box2,
      box3,
      box4,
      ground,

      ...walls /*    fire1, fire2,    jumpPad2,      fire, panel, portal3, portal4, catButton2,     box5,    weight, floor, mouse,*/,
    ]);

    // 충돌 감지
    Events.on(engine, "collisionStart", (event) => {
      handleCrasheweight(event);
      //handleBurnMouse(event);
      handleTeleport(event);
      //-------------텔레포트---------
      event.pairs.forEach((pair) => {
        //--------------cats--------------
        const { bodyA, bodyB } = pair;
        // mouse과 catButton이 충돌했을 때
        if (
          (bodyA === mouseRef.current && bodyB === catButton) ||
          (bodyA === catButton && bodyB === mouseRef.current)
        ) {
          //console.log("공이 고양이 버튼에 닿았습니다.");
          catButton.render.sprite.texture = "/assets/CatButtonPush.png";
          catButton.render.sprite.xScale = 0.05;
          catButton.render.sprite.yScale = 0.05;
          catButton.collisionFilter = {
            group: 0,
          }; // catButton의 충돌 필터 변경
          cat.render.sprite.texture = "/assets/CatClose.png";
          cat.render.sprite.xScale = 0.17;
          cat.render.sprite.yScale = 0.17; // cat의 색상을 빨간색으로 변경
        }
        // mouse과 catButton2이 충돌했을 때
        if (
          (bodyA === mouseRef.current && bodyB === catButton2) ||
          (bodyA === catButton2 && bodyB === mouseRef.current)
        ) {
          //console.log("공이 고양이 버튼에 닿았습니다.");
          catButton2.render.sprite.texture = "/assets/CatButtonPush.png";
          catButton2.render.sprite.xScale = 0.05;
          catButton2.render.sprite.yScale = 0.05;
          catButton2.collisionFilter = {
            group: 0,
          }; // catButton의 충돌 필터 변경
          cat.render.sprite.texture = "/assets/CatClose.png";
          cat.render.sprite.xScale = 0.17;
          cat.render.sprite.yScale = 0.17; // cat의 색상을 빨간색으로 변경
        }
        // mouse과 fallFloor가 충돌했을 때
        if (
          (bodyA === mouseRef.current && bodyB === fallFloor) ||
          (bodyA === fallFloor && bodyB === mouseRef.current)
        ) {
          setResultState(5);
        }
        // mouse과 cat이 충돌했을 때
        if (
          (bodyA === mouseRef.current && bodyB === cat) ||
          (bodyA === cat && bodyB === mouseRef.current)
        ) {
          // cat의 기분이 false이면 엔진을 멈추고, true이면 cat의 충돌 필터를 변경
          if (!(cat.render.sprite.texture === "/assets/CatClose.png")) {
            setResultState(4);
            playSound("/sound/CatMeow.wav");
            playSound("/sound/GameOver.wav");
            Engine.events = {}; // 엔진 이벤트 모두 제거
          } else {
            cat.collisionFilter = {
              group: 0,
            };
          }
        }
        //--------------cats-------------
        //------------cheese--------------
        if (
          (pair.bodyA === mouseRef.current && pair.bodyB === cheese) ||
          (pair.bodyA === cheese && pair.bodyB === mouseRef.current)
        ) {
          // mouse를 멈추고 게임 클리어를 알립니다.
          playSound("/sound/GameClear.wav");
          mouseRef.current.isStatic = true;
          setResultState(7);
        }
        //------------cheese--------------
        //------------leftArm------------
        // 만약 mouse가 leftArm과 충돌했다면
        if (
          (bodyA === mouseRef.current && bodyB === leftArmLeftRef.current) ||
          (bodyA === leftArmLeftRef.current && bodyB === mouseRef.current)
        ) {
          // 일정 속도를 유지하도록 설정
          onSlope = true;
        }
        //------------leftArm------------
        //------------rightArm------------
        if (
          (bodyA === mouseRef.current && bodyB === rightArmRightRef.current) ||
          (bodyA === rightArmRightRef.current && bodyB === mouseRef.current)
        ) {
          // 일정 속도를 유지하도록 설정
          onSlopeRight = true;
        }
        //------------rightArm------------
        //------------panel------------
        if (
          (bodyA === mouseRef.current && bodyB === panel) ||
          (bodyA === panel && bodyB === mouseRef.current)
        ) {
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
          playSound("/sound/Bomb.wav");
          World.remove(engine.world, bombRef.current);
          World.remove(engine.world, bombGround);
        }

        //--------bomb--------------

        //----------추가 바닥에 닿았을때-------------
        if (
          (bodyA === floor && bodyB === weight) ||
          (bodyA === weight && bodyB === floor)
        ) {
          playSound("/sound/Weight.wav");
          weight.isStatic = true;
        }
        //----------추가 바닥에 닿았을때-------------
        //--------------좌우반전---------------
        if (
          (bodyA === mouseRef.current && bodyB === box1) ||
          (bodyA === box1 && bodyB === mouseRef.current)
        ) {
          playSound("/sound/Pointer.mp3");
          World.remove(engine.world, [box1]); //box제거
          setIsRightPointer(true);
          //console.log("사라지는 바닥의 좌표:", mouse.position);
        }
        if (
          (bodyA === mouseRef.current && bodyB === box2) ||
          (bodyA === box2 && bodyB === mouseRef.current)
        ) {
          playSound("/sound/Pointer.mp3");
          World.remove(engine.world, [box2]); //box제거
          setIsRightPointer(false);
          //console.log("사라지는 바닥의 좌표:", mouse.position);
        }
        if (
          (bodyA === mouseRef.current && bodyB === box3) ||
          (bodyA === box3 && bodyB === mouseRef.current)
        ) {
          playSound("/sound/Pointer.mp3");
          World.remove(engine.world, [box3]); //box제거
          setIsRightPointer(false);
          console.log("사라지는 바닥의 좌표:", mouseRef.current.position);
        }
        if (
          (bodyA === mouseRef.current && bodyB === box4) ||
          (bodyA === box4 && bodyB === mouseRef.current)
        ) {
          playSound("/sound/Pointer.wav");
          World.remove(engine.world, [box4]); //box제거
          setIsRightPointer(true);
          // console.log("사라지는 바닥의 좌표:", mouse.position);
        }
        if (
          (bodyA === mouseRef.current && bodyB === box5) ||
          (bodyA === box5 && bodyB === mouseRef.current)
        ) {
          playSound("/sound/Pointer.mp3");
          World.remove(engine.world, [box5]); //box제거
          setIsRightPointer(!isRightPointer);
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
      // function handleBurnMouse(event) {
      //   event.pairs.forEach((pair) => {
      //     const { bodyA, bodyB } = pair;
      //     // fire 배열의 각 요소에 대해 충돌을 감지하여 게임 오버 처리
      //     fire.forEach((fireBody) => {
      //       if (
      //         (bodyA === fireBody && bodyB === mouseRef.current) ||
      //         (bodyA === mouseRef.current && bodyB === fireBody)
      //       ) {
      //         setResultState(2);
      //         burnMouse(); // 충돌 시 burnMouse 함수 호출
      //       }
      //     });
      //   });
      // }

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
            setResultState(2);
          }
        });
      }
      //마우스추에충돌시
      function crashMouse() {
        playSound("/sound/GameOver.wav");
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
            teleportLock === false && // 한 번의 충돌 이벤트에 대해서만 처리
            ((bodyA === portal2 && bodyB === mouseRef.current) ||
              (bodyA === mouseRef.current && bodyB === portal2))
          ) {
            playSound("/sound/Portal.wav");
            Body.setPosition(mouseRef.current, {
              x: portal1.position.x,
              y:
                portal1.position.y -
                portal1.circleRadius -
                mouseRef.current.circleRadius,
            });
            //console.log(portal2.position.y - portal2.circleRadius - mouse.circleRadius);
            teleportLock = true; // 포탈 사용 후 잠금
            portal1.collisionFilter = {
              group: 0,
            };
            // console.log(teleportLock);
            setTimeout(() => {
              teleportLock = false;
              portal1.collisionFilter = {
                group: 1,
              };
              //console.log("teleportLock after 5 sec", teleportLock);
            }, 100); // 1초 후 잠금 해제
          }
        });

        event.pairs.forEach((pair) => {
          const { bodyA, bodyB } = pair;
          if (
            teleportLock === false && // 한 번의 충돌 이벤트에 대해서만 처리
            ((bodyA === portal1 && bodyB === mouseRef.current) ||
              (bodyA === mouseRef.current && bodyB === portal1))
          ) {
            playSound("/sound/Portal.wav");
            console.log("here");
            console.log(
              portal1.position.x,
              portal1.position.y -
                portal1.circleRadius -
                mouseRef.current.circleRadius
            );
            Body.setPosition(mouseRef.current, {
              x: portal2.position.x,
              y:
                portal2.position.y -
                portal2.circleRadius -
                mouseRef.current.circleRadius,
            });
            //console.log(portal2.position.y - portal2.circleRadius - mouse.circleRadius);
            teleportLock = true; // 포탈 사용 후 잠금
            portal2.collisionFilter = {
              group: 0,
            };
            // console.log(teleportLock);
            setTimeout(() => {
              teleportLock = false;
              portal2.collisionFilter = {
                group: 1,
              };
              //console.log("teleportLock after 5 sec", teleportLock);
            }, 100); // 1초 후 잠금 해제
          }
        });
        //--------------------------portal1 & portal2--------------------------

        //--------------------------portal3 & portal4--------------------------
        event.pairs.forEach((pair) => {
          const { bodyA, bodyB } = pair;
          if (
            teleportLock === false && // 한 번의 충돌 이벤트에 대해서만 처리
            ((bodyA === portal4 && bodyB === mouseRef.current) ||
              (bodyA === mouseRef.current && bodyB === portal4))
          ) {
            playSound("/sound/Portal.wav");
            Body.setPosition(mouseRef.current, {
              x: portal3.position.x,
              y:
                portal3.position.y -
                portal3.circleRadius -
                mouseRef.current.circleRadius,
            });
            //console.log(portal2.position.y - portal2.circleRadius - mouse.circleRadius);
            teleportLock = true; // 포탈 사용 후 잠금
            portal3.collisionFilter = {
              group: 0,
            };
            // console.log(teleportLock);
            setTimeout(() => {
              teleportLock = false;
              portal3.collisionFilter = {
                group: 1,
              };
              //console.log("teleportLock after 5 sec", teleportLock);
            }, 100); // 1초 후 잠금 해제
          }
        });

        event.pairs.forEach((pair) => {
          const { bodyA, bodyB } = pair;
          if (
            teleportLock === false && // 한 번의 충돌 이벤트에 대해서만 처리
            ((bodyA === portal3 && bodyB === mouseRef.current) ||
              (bodyA === mouseRef.current && bodyB === portal3))
          ) {
            playSound("/sound/Portal.wav");
            console.log("here");
            console.log(
              portal3.position.x,
              portal3.position.y -
                portal3.circleRadius -
                mouseRef.current.circleRadius
            );
            Body.setPosition(mouseRef.current, {
              x: portal4.position.x,
              y:
                portal4.position.y -
                portal4.circleRadius -
                mouseRef.current.circleRadius,
            });
            //console.log(portal2.position.y - portal2.circleRadius - mouse.circleRadius);
            teleportLock = true; // 포탈 사용 후 잠금
            portal4.collisionFilter = {
              group: 0,
            };
            // console.log(teleportLock);
            setTimeout(() => {
              teleportLock = false;
              portal4.collisionFilter = {
                group: 1,
              };
              //console.log("teleportLock after 5 sec", teleportLock);
            }, 100); // 1초 후 잠금 해제
          }
        });
        //--------------------------portal3 & portal4--------------------------
      }
    });

    Events.on(engine, "collisionEnd", (event) => {
      const pairs = event.pairs;

      pairs.forEach((pair) => {
        const bodyA = pair.bodyA;
        const bodyB = pair.bodyB;
        //------------------------------leftArm---------------
        // 만약 mouse가 leftArm과 충돌 상태에서 벗어났다면
        if (
          (bodyA === mouseRef.current && bodyB === leftArmLeftRef.current) ||
          (bodyA === leftArmLeftRef.current && bodyB === mouseRef.current)
        ) {
          // 원래 상태로 돌아가도록 설정
          onSlope = false;
        }
        //------------------------------leftArm---------------

        //------------------------------rightArm---------------
        if (
          (bodyA === mouseRef.current && bodyB === rightArmRightRef.current) ||
          (bodyA === rightArmRightRef.current && bodyB === mouseRef.current)
        ) {
          // 원래 상태로 돌아가도록 설정
          onSlopeRight = false;
        }
        //------------------------------rightArm---------------
        //------------------------------panel---------------
        if (
          (bodyA === mouseRef.current && bodyB === panel) ||
          (bodyA === panel && bodyB === mouseRef.current)
        ) {
          // 원래 상태로 돌아가도록 설정
          onPanel = false;
        }
        //------------------------------panel---------------
      });
    });

    // ------------사라지는 바닥------------
    Events.on(engine, "collisionActive", (event) => {
      const pairs = event.pairs;

      pairs.forEach((pair) => {
        const bodyA = pair.bodyA;
        const bodyB = pair.bodyB;
        if (
          (bodyA === mouseRef.current && bodyB === ground) ||
          (bodyA === ground && bodyB === mouseRef.current)
        ) {
          collapsesGround();
        }
      });
    });
    // ------------사라지는 바닥------------

    //----------leftArm---------
    const originalSpeedX = 0.9;
    //----------leftArm---------
    Events.on(engine, "beforeUpdate", () => {
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
          const normalVector = {
            x: Math.sin(modifiedAngle),
            y: Math.cos(angle) * 0,
          };
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
          const normalVector = {
            x: Math.sin(modifiedAngle),
            y: Math.cos(angle) * 0,
          };
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
          const normalVector = {
            x: Math.sin(modifiedAngle),
            y: Math.cos(angle) * 0,
          };
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
    }, 3000);

    setTimeout(() => {
      Body.setStatic(weight, false);
      Body.applyForce(
        weight,
        { x: weight.position.x, y: weight.position.y },
        { x: -0.0018, y: 0 }
      );
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
    return isRightPointer;
  }
};
