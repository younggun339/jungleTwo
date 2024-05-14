import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface User {
  [roomName: string]: string[];
}

@WebSocketGateway({ cors: true })
export class WebRTCGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private users: User = {};
  private user_dict: { [key: string]: [string, string][] } = {};
  private socketToRoom: { [key: string]: string } = {};

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    const roomName = this.socketToRoom[client.id];
    console.log(roomName)
    if (roomName) {
      let room = this.users[roomName];
      if (room) {
        room = room.filter((id) => id !== client.id);
        this.users[roomName] = room;
      }
      delete this.socketToRoom[client.id];
      this.server.to(roomName).emit('user-left', client.id);
    }
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(client: Socket, roomName: string) {
    if (this.users[roomName]) {
      const room = this.users[roomName];
      if (room.length === 2) {
        client.emit('room-full');
        return;
      } else {
        room.push(client.id);
      }
    } else {
      this.users[roomName] = [client.id];
    }

    this.socketToRoom[client.id] = roomName;
    const usersInThisRoom = this.users[roomName].filter((id) => id !== client.id);
    client.emit('all-users', usersInThisRoom);
  }

  @SubscribeMessage('sending-signal')
  handleSendingSignal(client: Socket, payload: { userToSignal: string; signal: any; callerID: string }) {
    console.log(`Sending signal from ${client.id} to ${payload.userToSignal}`);
    this.server.to(payload.userToSignal).emit('user-joined', { signal: payload.signal, callerID: payload.callerID });
  }

  @SubscribeMessage('returning-signal')
  handleReturningSignal(client: Socket, payload: { callerID: string; signal: any }) {
    console.log(`Returning signal to ${payload.callerID} from ${client.id}`);
    this.server.to(payload.callerID).emit('receiving-returned-signal', { signal: payload.signal, id: client.id });
  }

  @SubscribeMessage('start-game')
  handleStartGame(client: Socket, payload: { roomId: string }) {
    console.log("someone started game in room:", payload.roomId);
    // 방의 모든 사용자에게 게임 시작 이벤트를 전송
    const usersInThisRoom = this.users[payload.roomId].filter((id) => id !== client.id);
    if (usersInThisRoom) {
      usersInThisRoom.forEach(userId => {
        console.log(`Emitting game-started to user: ${userId}`);
        this.server.to(userId).emit('game-started');
      });
    }
  }
  @SubscribeMessage('user-signal')
  handleUserSignal(client: Socket, user: {gameRoomID:string; userName: string}) {
    if (!this.user_dict[user.gameRoomID]) {
      this.user_dict[user.gameRoomID] = [];
    }
    if (!this.socketToRoom[client.id]) {
      
    }
    this.user_dict[user.gameRoomID].push([client.id, user.userName]);
    console.log(this.user_dict[user.gameRoomID]);
  }
}
