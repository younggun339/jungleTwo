// simulation.gateway.ts
import { OnModuleDestroy } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import * as Matter from 'matter-js';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ["GET", "POST"],
  }
})
export class SimulationGateway implements OnModuleDestroy {
  @WebSocketServer()
  server: Server;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  public startContinuousUpdate(mouseRef: Matter.Body, bombRef: Matter.Body, engine: Matter.Engine) {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    this.intervalId = setInterval(() => {
      Matter.Body.applyForce(mouseRef, { x: mouseRef.position.x, y: mouseRef.position.y }, { x: 0.1, y: 0 });
      console.log("mouse x: ", mouseRef.position.x);
      this.server.emit('mouse-journey', {
        mousePos: mouseRef.position,
        bombPos: bombRef.position,
        bombAngle: bombRef.angle
      });
    }, 1000 / 60);
  }

  public stopUpdate() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.server) {
      try {
        this.server.close();
      } catch (error) {
        console.error('Failed to close the WebSocket server:', error);
      }
    }
  }

  onModuleDestroy() {
    this.stopUpdate();
  }
}