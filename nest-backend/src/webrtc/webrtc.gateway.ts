import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface User {
  [roomId: string]: string[];
}

@WebSocketGateway({ cors: true })
export class WebRTCGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private users: User = {};
  private socketToRoom: { [socketId: string]: string } = {};

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    const roomId = this.socketToRoom[client.id];
    if (roomId) {
      let room = this.users[roomId];
      if (room) {
        room = room.filter((id) => id !== client.id);
        this.users[roomId] = room;
      }
      delete this.socketToRoom[client.id];
      this.server.to(roomId).emit('user-left', client.id);
    }
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(client: Socket, roomId: string) {
    if (this.users[roomId]) {
      const room = this.users[roomId];
      if (room.length === 2) {
        client.emit('room-full');
        return;
      } else {
        room.push(client.id);
      }
    } else {
      this.users[roomId] = [client.id];
    }

    this.socketToRoom[client.id] = roomId;
    const usersInThisRoom = this.users[roomId].filter((id) => id !== client.id);
    client.emit('all-users', usersInThisRoom);
  }

  @SubscribeMessage('sending-signal')
  handleSendingSignal(client: Socket, payload: { userToSignal: string; signal: any; callerID: string }) {
    this.server.to(payload.userToSignal).emit('user-joined', { signal: payload.signal, callerID: payload.callerID });
  }

  @SubscribeMessage('returning-signal')
  handleReturningSignal(client: Socket, payload: { callerID: string; signal: any }) {
    this.server.to(payload.callerID).emit('receiving-returned-signal', { signal: payload.signal, id: client.id });
  }

  @SubscribeMessage('send-left-hand-joint')
  handleSendLeftHandJoint(client: Socket, payload: { joint1Start: any; joint1End: any; receiverID: string }) {
    this.server.to(payload.receiverID).emit('send-left-hand-joint', {
      joint1Start: payload.joint1Start,
      joint1End: payload.joint1End,
      senderID: client.id,
    });
  }

  @SubscribeMessage('send-right-hand-joint')
  handleSendRightHandJoint(client: Socket, payload: { joint1: any; joint2: any; joint3: any; receiverID: string }) {
    this.server.to(payload.receiverID).emit('send-right-hand-joint', {
      joint1: payload.joint1,
      joint2: payload.joint2,
      joint3: payload.joint3,
      senderID: client.id,
    });
  }
}
