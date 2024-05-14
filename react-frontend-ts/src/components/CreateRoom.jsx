import React, { useState, useEffect } from "react";
import "../styles/room.css";
import RoomModal from "./MakeModal"
import ChangeName from "./ChangeName"

const CreateRoom = ({ userName }) => {
  const [rooms, setRooms] = useState([]);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const isLoggedIn = userName !== "";

  const handleCreateRoom = (event) => {
    event.preventDefault(); // 기본 제출 행동 방지

    const generateRandomString = (num) => {
      const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      let result = '';
      const charactersLength = characters.length;
      for (let i = 0; i < num; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
    
      return result;
    }
    const newRoomId = generateRandomString(8)
    const roomName = event.currentTarget.elements.roomName.value;
    let passWord = null;
    if(showPasswordInput){
      passWord = event.currentTarget.elements.password.value;
      if (passWord === "") {
        document.getElementById('roomName').value = '';
        return
      }
    }

    fetch("https://zzrot.store/room/new", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ room_id: newRoomId, room_name: roomName, room_master: userName,room_pw:passWord }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.result) {
          window.location.assign("https://zzrot.store/game/"+newRoomId);
        }
      })
      .catch(error => {
        console.error('Error:', error);
    });
    
    document.getElementById('roomName').value = '';
    if (showPasswordInput) {
      document.getElementById('password').value = '';
    }
  };

  const refreshRoom = () => {
    fetch("https://zzrot.store/room/get")
      .then(response => response.json())
      .then(data => {
        setRooms(data)
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  useEffect(() => {
    refreshRoom();
  }, []);

  const togglePasswordInput = () => {
    setShowPasswordInput(!showPasswordInput);
  };

  const logout = () => {
    fetch("https://zzrot.store/logout")
      .then(() => {
        window.location.reload();
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
    
  const login = () => {
    window.location.assign("https://zzrot.store/");
  };

  return (
    <>
      <div className="Container">
        <p>
          <img src="/images/profile.png" className="profile" />
          {userName && <span>{userName}</span>}
          <span>{(userName === null || userName === undefined) && '로그인 안됨'}</span>
        </p>
        <div className="SplitContainer">
          <div className="CreateRoomContainer">
            <p>
              {/* <img src="/images/team2logo.png" alt="Team Logo" className="Logo" /> */}
            </p>
            <img src="/images/lattadoit.png" alt="Team Logo" className="Logo"/>
            <div className="CreateRoom2">
              <form onSubmit={handleCreateRoom}>
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
              <ChangeName/>
              </div>
              {rooms.map((room) => (
                <div key={room.id}>
                  <RoomModal room={room} />
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