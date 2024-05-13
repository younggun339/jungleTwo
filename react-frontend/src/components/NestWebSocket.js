// NestWebSocket.js
import io from 'socket.io-client';

class NestWebSocket {
  constructor(url) {
    this.url = url;
    this.socket = this.connect();
  }

  connect() {
    // WebSocket 서버에 연결합니다.
    const socket = io(this.url);

    // 연결이 성공적으로 이루어졌을 때 실행할 로직
    socket.on('connect', () => {
      console.log('WebSocket connected:', socket.id);
    });

    // 연결에 실패했을 때 실행할 로직
    socket.on('connect_error', (error) => {
      console.error('Connection Error:', error);
    });

    // 연결이 종료되었을 때 실행할 로직
    socket.on('disconnect', (reason) => {
      console.log('Disconnected:', reason);
    });

    return socket;
  }

  // 서버로부터 'testResponse' 메시지를 받을 때 처리할 핸들러를 등록합니다.
  onTestResponse(handler) {
    this.socket.on('testResponse', handler);
  }

  // 'test' 이벤트를 서버로 전송합니다.
  sendTest(data) {
    this.socket.emit('test', data);
    console.log('Sent test event with data:', data);
  }

  // WebSocket 연결을 종료합니다.
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      console.log('WebSocket disconnected');
    }
  }
}

// WebSocket 서버의 URL
const websocketUrl = "https://43.203.29.69/mouse-journey";

// NestWebSocket 인스턴스를 생성합니다.
const nestWebSocket = new NestWebSocket(websocketUrl);

export default nestWebSocket;