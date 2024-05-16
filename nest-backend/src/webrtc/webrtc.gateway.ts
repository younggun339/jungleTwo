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
  private room_user: { [key: string]: [string, string, boolean][] } = {};
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
    for (let i = 0; i < this.room_user[roomName].length; i++) {
        const users = this.room_user[roomName][i];
        this.server.to(users[0]).emit('user', this.room_user[roomName]);
    }

    Object.keys(this.room_user).forEach(roomName => {
      const users = this.room_user[roomName]; 
      if (users?.[0] == "" && users?.[1] == "") {

      }
    });
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
  @SubscribeMessage('user-signal')
  handleUserSignal(client: Socket, data: { gameRoomID: string; userName: string }) {
    const { gameRoomID, userName } = data;
    if (!this.room_user[gameRoomID]) {
      this.room_user[gameRoomID] = [];
    }

    if (!this.user_room[client.id]) {
      this.user_room[client.id] = gameRoomID;
    }

    this.room_user[gameRoomID].push([client.id, userName, false]);
    console.log(`${gameRoomID} 방에 입장 : ${this.room_user[gameRoomID]}`);
    console.log(`현재 유저 ${userName}의 방: ${this.user_room[client.id]}`);


    setTimeout(() => {
      this.room_user[gameRoomID].forEach((user) => {
        this.server.to(user[0]).emit('user', this.room_user[gameRoomID]);
      });
    }, 2000);
  }

  @SubscribeMessage('ready-game')
  handleStartGame(client: Socket, payload: { roomName: string, userName: string }) {
    const roomName = payload.roomName;

    // 방에 사용자 추가
    if (!this.room_user[roomName]) {
      this.room_user[roomName] = [];
      this.room_user[roomName].push([client.id, payload.userName, false]);
    }
    
    // 모든 사용자에게 현재 준비 상태 전송
    const players = this.room_user[roomName];
    for (let i = 0; i < players.length; i++) {
      const [clientId, name, isReady] = players[i];
      if (name === payload.userName) {
        players[i] = [clientId, name, true];
      }
    }

    this.room_user[roomName].forEach((user) => {
      this.server.to(user[0]).emit('response-ready', players);
    });
  }
}