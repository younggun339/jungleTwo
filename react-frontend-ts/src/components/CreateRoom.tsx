import React, { useState, useEffect } from "react";
// import RoomModal from "./MakeModal"
// import ChangeName from "./ChangeName"
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
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const isLoggedIn = user_name !== "";

  const createRoom = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // 기본 제출 행동 방지

    const form = event.target as HTMLFormElement;
    const roomNameInput = form.elements.namedItem("roomName") as HTMLInputElement;
    const passwordInput = form.elements.namedItem("password") as HTMLInputElement;

    const generateRandomString = (num: number): string => {
      const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      let result = '';
      const charactersLength = characters.length;
      for (let i: number = 0; i < num; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
    
      return result;
    }

    const roomName = roomNameInput.value;
    const password = passwordInput.value;

    fetch("http://localhost/room/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        room_id: generateRandomString(8),
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

  useEffect(() => {
    refreshRoom();
  }, []);

  const togglePasswordInput = () => {
    setShowPasswordInput(!showPasswordInput);
  };

  const logout = () => {
    fetch("http://zzrot.store/logout")
      .then(() => {
        window.location.reload();
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
    
  const login = () => {
    window.location.assign("http://zzrot.store/");
  };


  return (
    <>
      <div className="Container">
        <div className="SplitContainer">
          <div className="CreateRoomContainer">
            <p>
              {/* <img src="/images/team2logo.png" alt="Team Logo" className="Logo" /> */}
            </p>
            <img src="/images/lattadoit.png" alt="Team Logo" className="Logo"/>
            <div className="CreateRoom2">
              <form onSubmit={createRoom}>
                <h1>새로운 방 만들기</h1>
                <div className="inputGroup">
                  <input
                    type="text"
                    id="roomName"
                    className="inputField2"
                    placeholder="방 이름"
                    style={{marginBottom:'10px'}}
                  />
                  {showPasswordInput && (
                    <input
                      type="password"
                      id="password"
                      className="inputField2"
                      placeholder="방 비밀번호"
                    />
                  )}
                </div>
                <button className="refreshRoom">
                  방 생성
                </button>
              </form>  
              <button onClick={togglePasswordInput} className="refreshRoom" style={{marginRight:'50px'}}>
                비밀 번호 {showPasswordInput ? '등록 취소' : '등록'}
              </button>
            </div>
          </div>

          <div className="RoomListContainer2">
            <div className="hi">
              <h1 style={{ textAlign: 'center' }}>방 목록</h1>
              <div className="RoomListContainerButtons">
              <button onClick={refreshRoom} className="refreshRoom">
                새로고침
              </button>
              {isLoggedIn ? (
                <>
                  <button onClick={logout} className="refreshRoom">
                    로그아웃
                  </button>
                </>
              ) : (
                <button onClick={login} className="refreshRoom">
                  로그인
                </button>
              )}
              {/* <ChangeName/> */}
              </div>
              {rooms.map((room) => (
                <div key={room.id}>
                  {/* <RoomModal room={room} /> */}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateRoom;