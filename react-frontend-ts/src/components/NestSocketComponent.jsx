import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

const NestSocketComponent = () => {
    const nestjsSocketRef = useRef(null);

    useEffect(() => {
        nestjsSocketRef.current = io("https://zzrot.store/");

        nestjsSocketRef.current.on('connect', () => {
            console.log('Connected to NestJS WebSocket');
        });
    }, []);

    return (
        <div>
            NestJS WebSocket Component
        </div>
    );
};

export default NestSocketComponent;
