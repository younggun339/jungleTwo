import { ConsoleLogger } from '@nestjs/common';
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
  // { roomName: [client.id, 유저 이름, 준비 상태] } 사전
  private room_user: { [key: string]: [string, string, boolean][] } = {};
  // { roomName: client.id } 사전
  private user_room: { [key: string]: string } = {};

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    const roomName = this.user_room[client.id];
    delete this.user_room[client.id];
  
    // roomName이 room_user에 존재하는지 확인
    if (this.room_user[roomName]) {
      for (let i = 0; i < this.room_user[roomName].length; i++) {
        if (this.room_user[roomName][i][0] === client.id) {
          this.room_user[roomName].splice(i, 1);
          break;
        }
      }
  
      if (this.room_user[roomName].length === 0) {
        setTimeout(() => {
          console.log("빈방: " + roomName);
          this.server.emit("delete", roomName);
        }, 1000);
      } else {
        setTimeout(() => {
          for (let i = 0; i < this.room_user[roomName].length; i++) {
            const users = this.room_user[roomName][i];
            this.server.to(users[0]).emit("user", this.room_user[roomName]);
          }
        }, 1000);
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

    const usersInThisRoom = this.users[roomName].filter((id) => id !== client.id);
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

  @SubscribeMessage('user-signal')
  handleUserSignal(client: Socket, payload: {gameRoomID:string; userName: string}) {
    if (!this.room_user[payload.gameRoomID]) {
      this.room_user[payload.gameRoomID] = [];
    }
    if (!this.user_room[client.id]) {
      this.user_room[client.id] = payload.gameRoomID;
    }
    this.room_user[payload.gameRoomID].push([client.id, payload.userName, false]);
    console.log(payload.gameRoomID+ " 방에 입장 : " + this.room_user[payload.gameRoomID]);
    console.log("현재 유저 " + payload.userName + "의 방: " + this.user_room[client.id])

    console.log("현재 방의 사용자들: ", this.room_user[payload.gameRoomID]);

    setTimeout(() => {
      for (let i = 0; i < this.room_user[payload.gameRoomID].length; i++) {
        const users = this.room_user[payload.gameRoomID][i];
        this.server.to(users[0]).emit("user", this.room_user[payload.gameRoomID]);
      }
    }, 1000);
  }

  @SubscribeMessage('ready-game')
  handleStartGame(client: Socket, payload: { roomName: string, userName: string }) {
    const roomName = payload.roomName;
    console.log("준비완료 ", payload.roomName, payload.userName);
    console.log("이 방의 사용자들: ", this.room_user[roomName]);

  // roomName이 room_user에 존재하는지 확인
    // 방에 사용자가 없으면 새로 추가
    if (!this.room_user[roomName]) {
      this.room_user[roomName] = [];
      this.room_user[roomName].push([client.id, payload.userName, false]);
      this.user_room[client.id] = roomName;
    }
  
    // 기존 사용자의 준비 상태를 true로 업데이트
    const players = this.room_user[roomName];
    for (let i = 0; i < players.length; i++) {
      const [id, name, _] = players[i];
      if (name === payload.userName) {
        players[i] = [id, name, true];
      }
    }
  
    // 모든 사용자에게 현재 준비 상태 전송
    // setTimeout(() => {
    console.log(players[0][1], ": 준비 완료");
    for (let i = 0; i < players.length; i++) {
      const users = this.room_user[roomName][i];
      this.server.to(users[0]).emit("response-ready", players);
    }
    // }, 1000);
  }
}
