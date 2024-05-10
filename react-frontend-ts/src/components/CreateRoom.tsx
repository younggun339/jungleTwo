import React, { useState } from "react";
import { v1 as uuid } from "uuid";
import { Link } from "react-router-dom";
import "../styles/room.css";

interface CreateRoomProps {
  user_name: string | null;
}

interface Room {
  id: string;
  room_id: string;
  room_name: string;
  room_master: string;
}

const CreateRoom: React.FC<CreateRoomProps> = ({ user_name }) => {
  const [rooms, setRooms] = useState<Room[]>([]);

  const createRoom = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // 기본 제출 행동 방지

    const form = event.target as HTMLFormElement;
    const roomNameInput = form.elements.namedItem("roomName") as HTMLInputElement;
    const passwordInput = form.elements.namedItem("password") as HTMLInputElement;

    const newRoomId = uuid(); // 방 ID 생성
    const roomName = roomNameInput.value;
    const password = passwordInput.value;

    fetch("http://localhost/room/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        room_id: newRoomId,
        room_name: roomName,
        room_pw: password,
        room_master: user_name,
      }),
    }).catch((error) => {
      console.error("Error:", error);
    });
  };

  const refreshRoom = () => {
    fetch("http://localhost/room/get")
      .then((response) => response.json())
      .then((data) => {
        setRooms(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="Container">
      <div className="SplitContainer">
        <div className="CreateRoomContainer">
          <p>
            {" "}
            {/* <img src="/images/team2logo.png" alt="Team Logo" className="Logo" /> */}
          </p>
          <img
            src="/images/lattadoit.png"
            alt="Team Logo"
            style={{ width: "250pt", marginBottom: "30pt" }}
          />
          <div className="CreateRoom2">
            <form onSubmit={createRoom}>
              <h1>새로운 방 만들기</h1>
              <div className="inputGroup">
                <input
                  type="text"
                  id="roomName"
                  className="inputField2"
                  placeholder="방 이름"
                />
              </div>
              <div>
                <div className="inputGroup">
                  <input
                    type="password"
                    id="password"
                    className="inputField2"
                    placeholder="방 비밀번호"
                  />
                </div>
              </div>
              <button type="submit" className="refreshRoom">
                방생성
              </button>
            </form>
          </div>
          <Link to="/game1">
            <button className="refreshRoom">Game 1</button>
          </Link>
          <Link to="/game2">
            <button className="refreshRoom">Game 2</button>
          </Link>
          <Link to="/room">
            <button className="refreshRoom">인게임뷰</button>
          </Link>
        </div>

        <div className="RoomListContainer2">
          <div>
            <h1 style={{ textAlign: "center" }}>방 목록</h1>
            <button onClick={refreshRoom} className="refreshRoom">
              새로고침
            </button>
            <ul>
              <div>
                <button className="roomButton2">
                  <img src="/images/mouse.webp" alt="mouse" />
                  <div className="roomButtonText">
                    <h3> 오늘 열심히 합시다... </h3>
                    <h5> abc123le </h5>
                  </div>
                </button>
                <button className="roomButton2">
                  <img src="/images/mouse.webp" alt="mouse" />
                  <div className="roomButtonText">
                    <h3>비밀번호 1234임 </h3>
                    <h5>abc123le </h5>
                  </div>
                </button>
              </div>
              {rooms.map((room) => (
                <li key={room.id} className="List">
                  <Link to={`/room/${room.room_id}`} className="roomLink">
                    <button className="roomButton">
                      제목: {room.room_name}, 방장: {room.room_master}
                    </button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;