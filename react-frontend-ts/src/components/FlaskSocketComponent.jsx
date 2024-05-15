import React, { useEffect, useRef } from 'react';

const FlaskSocketComponent = () => {
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = new WebSocket('wss://zzrot.store/ws');

        socketRef.current.onopen = () => {
            console.log('WebSocket Client Connected');
        };

        socketRef.current.onmessage = (message) => {
            const data = JSON.parse(message.data);
            console.log('Received JSON data from server:', data);
        };

        socketRef.current.onclose = () => {
            console.log('WebSocket Client Disconnected');
        };

        return () => {
            socketRef.current.close();
        };
    }, []);

    return (
        <div>
            FlaskSocket Component
        </div>
    );
};

export default FlaskSocketComponent;
