import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function RoomCheck({ children }) {
    const { gameRoomID } = useParams();
    const [room, setRoom] = useState(false);

    useEffect(() => {
        fetch("https://zzrot.store/room/" + gameRoomID, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        })
        .then(response => response.json())
        .then(data => {
            if (!data.result) {
                setRoom(false);
            } else {
                setRoom(true);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }, []);

    return room ? children : null;
}

export default RoomCheck;