// mouseEvent.gateway.ts 파일

// import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayInit } from '@nestjs/websockets';
// import { Server } from 'socket.io';

// @WebSocketGateway()
// export class MouseEventGateway implements OnGatewayInit {
//   @WebSocketServer() server: Server;

//   afterInit(server: Server) {
//     console.log('WebSocket server initialized');
//   }

//   @SubscribeMessage('coords')
//   handleCoords(client: any, data: any) {
//     // 여기서 좌표 정보를 받고 peer에게 전달합니다.
//     const { joint1Start, joint1End } = data;
//     if (joint1Start && joint1End) {
//       // 좌표 정보를 peer에게 전달합니다.
//       this.server.emit('coordsUpdate', { joint1Start, joint1End });
//     }
//   }
// }
