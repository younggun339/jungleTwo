// simulation.gateway.ts
import { OnModuleDestroy } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as Matter from 'matter-js';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ["GET", "POST"],
  },
  path: '/mouse-journey'
})
export class SimulationGateway implements OnModuleDestroy, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.count('Init');
  }

  handleDisconnect(client: Socket) {
    console.log('disconnect');
  }

  handleConnection(client: Socket) {
    console.log('connect');
  }

  // 'test' 이벤트를 처리하는 핸들러
  @SubscribeMessage('test')
  handleTestEvent(@MessageBody() data: string): void {
    console.log('Received test event with data:', data);
    // 여기에 필요한 로직 추가
    // 예를 들어, 모든 클라이언트에게 메시지를 에코하는 경우
    this.server.emit('testResponse', data);
  }


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