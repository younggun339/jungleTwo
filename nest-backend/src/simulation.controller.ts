// simulation.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import * as Matter from 'matter-js';
import { SimulationGateway } from './simulation.gateway';

@Controller()
export class SimulationController {
  private engine: Matter.Engine;
  private world: Matter.World;
  private runner: Matter.Runner;
  private isSimRunning: boolean = false;
  private isGameClear: boolean = false;
  private isBombed: boolean = false;

  private canvasSize: { x: number, y: number };
  private walls: Matter.Body[];
  private mouseRef: Matter.Body;
  private bombRef: Matter.Body;
  private goal: Matter.Body;
  private leftArmLeft: Matter.body;
  private rightHand1Right: Matter.body;
  private rightHand2Right: Matter.body;

  constructor( private simulationGateway: SimulationGateway ) {
    this.engine = Matter.Engine.create();
    this.world = this.engine.world;
    this.runner = Matter.Runner.create();
    this.engine.world.gravity.y = 0.6;
    this.initializeWorld();
  }

  private initializeWorld() {
    const { Bodies, World } = Matter;
    this.canvasSize = { x: 1600, y: 600 };

    this.walls = [
      Bodies.rectangle(this.canvasSize.x / 2, 0, this.canvasSize.x, 50, { isStatic: true }),
      Bodies.rectangle(this.canvasSize.x / 2, this.canvasSize.y, this.canvasSize.x, 50, { isStatic: true }),
      Bodies.rectangle(0, this.canvasSize.y / 2, 50, this.canvasSize.y, { isStatic: true }),
      Bodies.rectangle(this.canvasSize.x, this.canvasSize.y / 2, 50, this.canvasSize.y, { isStatic: true }),
    ];

    const platforms = [
      Bodies.rectangle(100, 200, 200, 30, { isStatic: true }),
      Bodies.rectangle(1200, 400, 800, 30, { isStatic: true })
    ];

    this.goal = Bodies.polygon(1300, 350, 3, 20, { isStatic: true });

    this.bombRef = Bodies.circle(1000, 100, 30, { isStatic: true, restitution: 0.5, friction: 0.3, density: 0.05 });
    this.mouseRef = Bodies.circle(100, 100, 30, { isStatic: true, restitution: 0.5, friction: 0.3, density: 0.05 });

    this.leftArmLeft = Bodies.rectangle(this.canvasSize.x / 2, this.canvasSize.y / 2, 0, 15, { isStatic: true });
    this.rightHand1Right = Bodies.rectangle(this.canvasSize.x / 2, this.canvasSize.y / 2, 0, 15, { isStatic: true });
    this.rightHand2Right = Bodies.rectangle(this.canvasSize.x / 2, this.canvasSize.y / 2, 0, 15, { isStatic: true });

    World.add(this.world, [...this.walls, ...platforms, this.goal, this.mouseRef, this.bombRef, this.leftArmLeft, this.rightHand1Right, this.rightHand2Right]);
    Matter.Runner.run(this.runner, this.engine);
  }

  private setupCollisionEvents() {
    Matter.Events.on(this.engine, "collisionStart", event => {
      event.pairs.forEach(pair => {

        // 쥐와 골이 충돌하는 경우
        if (this.isSimRunning && pair.bodyA === this.goal && pair.bodyB === this.mouseRef) {
          this.isGameClear = true;
          this.simulationGateway.stopUpdate();
        }
        // 쥐와 벽이 충돌하는 경우
        if (this.isSimRunning && pair.bodyA === this.walls[1] && pair.bodyB === this.mouseRef) {
          this.simulationGateway.stopUpdate();
        }
        // 쥐와 폭탄이 충돌하는 경우
        if (this.isSimRunning && pair.bodyA === this.bombRef && pair.bodyB === this.mouseRef) {
          this.isBombed = true;
          this.simulationGateway.stopUpdate();
        }
      });
    });
  }

  @Post('simulation-start')
  async startSimulation(@Body() body: any): Promise<SimulationResult> {
    this.setupCollisionEvents();
    this.isSimRunning = true;

    if (body.fixedRef1 && body.fixedRef2 && body.fixedRef3) {
      const { Body, Bodies } = Matter;

      // 스켈레톤으로부터 추출한 고정 객체 정보를 바탕으로 고정된 물리 객체 변환
      Body.setPosition(this.leftArmLeft, { x: body.fixedRef1.x, y: body.fixedRef1.y });
      Body.setPosition(this.rightHand1Right, { x: body.fixedRef2.x, y: body.fixedRef2.y });
      Body.setPosition(this.rightHand2Right, { x: body.fixedRef3.x, y: body.fixedRef3.y });

      Body.setAngle(this.leftArmLeft, body.fixedRef1.angle);
      Body.setAngle(this.rightHand1Right, body.fixedRef2.angle);
      Body.setAngle(this.rightHand2Right, body.fixedRef3.angle);

      Body.setVertices(this.leftArmLeft, Bodies.rectangle(body.fixedRef1.x, body.fixedRef1.y, body.fixedRef1.width, 15, { angle: body.fixedRef1.angle }).vertices);
      Body.setVertices(this.rightHand1Right, Bodies.rectangle(body.fixedRef2.x, body.fixedRef2.y, body.fixedRef2.width, 15, { angle: body.fixedRef2.angle }).vertices);
      Body.setVertices(this.rightHand2Right, Bodies.rectangle(body.fixedRef3.x, body.fixedRef3.y, body.fixedRef3.width, 15, { angle: body.fixedRef3.angle }).vertices);
  
      Body.setStatic(this.mouseRef, false);
      Body.setStatic(this.bombRef, false);

      this.simulationGateway.startContinuousUpdate(this.mouseRef, this.bombRef, this.engine);
      
      // 게임 종료를 Promise.race로 둘 중 먼저 달성되는 조건으로 처리
      return Promise.race([
        // 10초가 지나면 게임 종료
        new Promise<{ isGameClear: boolean; isBombed: boolean }>((resolve) => {
          setTimeout(() => {
            if (this.isSimRunning) {
              this.isSimRunning = false;
              this.isBombed = true;
              this.simulationGateway.stopUpdate();
              resolve({ isGameClear: this.isGameClear, isBombed: this.isBombed });
            }
          }, 10000);
        }),
        // 게임 클리어 또는 벽|폭탄에 닿으면 게임 종료
        new Promise<{ isGameClear: boolean; isBombed: boolean }>((resolve) => {
          this.simulationGateway.stopUpdate = () => {
            if (this.isSimRunning) {
              this.isSimRunning = false;
              resolve({ isGameClear: this.isGameClear, isBombed: this.isBombed });
            }
          };
        })
      ]);
    }
  }
}

interface SimulationResult {
  isGameClear: boolean;
  isBombed: boolean;
}