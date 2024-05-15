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
  private room_user: { [key: string]: [string, string][] } = {};
  private user_room: { [key: string]: string } = {};

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    const roomName = this.user_room[client.id];
    delete this.user_room[client.id];

    for (let i = 0; i < this.room_user[roomName].length; i++) {
        if (this.room_user[roomName][i][0] === client.id) {
            this.room_user[roomName].splice(i, 1);
            break;
        }
    }

    if (this.room_user[roomName].length === 0) {
        this.server.to(roomName).emit('delete', roomName);
        this.server.socketsLeave(roomName);
        delete this.room_user[roomName];
        console.log('빈방: ' + roomName);
    } else {
        for (let i = 0; i < this.room_user[roomName].length; i++) {
            const users = this.room_user[roomName][i];
            this.server.to(users[0]).emit('user', this.room_user[roomName]);
        }
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

    const usersInThisRoom = this.users[roomName].filter(
      (id) => id !== client.id,
    );
    client.emit('all-users', usersInThisRoom);
  }

  @SubscribeMessage('sending-signal')
  handleSendingSignal(
    client: Socket,
    payload: { userToSignal: string; signal: any; callerID: string },
  ) {
    this.server.to(payload.userToSignal).emit('user-joined', {
      signal: payload.signal,
      callerID: payload.callerID,
    });
  }

  @SubscribeMessage('returning-signal')
  handleReturningSignal(
    client: Socket,
    payload: { callerID: string; signal: any },
  ) {
    this.server.to(payload.callerID).emit('receiving-returned-signal', {
      signal: payload.signal,
      id: client.id,
    });
  }

  @SubscribeMessage('start-game')
  handleStartGame(client: Socket, payload: { roomId: string }) {
    console.log('someone started game in room:', payload.roomId);
    const usersInThisRoom = this.users[payload.roomId].filter(
      (id) => id !== client.id,
    );
    if (usersInThisRoom) {
      usersInThisRoom.forEach((userId) => {
        this.server.to(userId).emit('game-started');
      });
    }
  }
    @SubscribeMessage('user-signal')
    handleUserSignal(client: Socket, data: { gameRoomID: string; userName: string }) {
      const { gameRoomID, userName } = data;
      if (!this.room_user[gameRoomID]) {
        this.room_user[gameRoomID] = [];
      }
  
      if (!this.user_room[client.id]) {
        this.user_room[client.id] = gameRoomID;
      }
  
      this.room_user[gameRoomID].push([client.id, userName]);
      console.log(`${gameRoomID} 방에 입장 : ${this.room_user[gameRoomID]}`);
      console.log(`현재 유저 ${userName}의 방: ${this.user_room[client.id]}`);
      this.room_user[gameRoomID].forEach((user) => {
        this.server.to(user[0]).emit('user', this.room_user[gameRoomID]);
      });
    }
  }