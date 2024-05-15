import { useEffect, useState } from 'react';

const useWebSocket = (url: string) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        const socketInstance = new WebSocket(url);

        socketInstance.onopen = () => {
            console.log(`Connected to ${url}`);
        };

        socketInstance.onmessage = (event: MessageEvent) => {
            setMessages(prev => [...prev, event.data]);
        };

        socketInstance.onclose = () => {
            console.log(`Disconnected from ${url}`);
        };

        setSocket(socketInstance);
    }, [url]);

    const sendMessage = (msg: string) => {
        if (socket) {
            socket.send(msg);
        }
    };

    return { messages, sendMessage };
};

export default useWebSocket;
