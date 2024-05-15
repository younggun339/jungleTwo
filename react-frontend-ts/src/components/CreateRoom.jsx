import React, { useState, useEffect } from "react";
import "../styles/room.css";
import RoomModal from "./MakeModal"
import ChangeName from "./ChangeName"


const CreateRoom = ({ userName }) => {
  const [rooms, setRooms] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const isLoggedIn = userName !== null;

  console.log(userName)
  console.log(isLoggedIn)

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
    if(showPassword){
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
    if (showPassword) {
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

  const profileClick = () => {
    setIsMenuVisible(!isMenuVisible); // 상태를 토글합니다.
  }

  return (
    <div>
        <div className='totalContain'>
            <div className='header'> 
            {isLoggedIn ? (
              <div className="profile" onClick={profileClick} >
                <img src="/images/profile.png"/>
                {userName}
                {isMenuVisible && (
                <div className="menu">
                  <ul>
                    <li><ChangeName/></li>
                    <li onClick={logout}>로그아웃</li>
                  </ul>
                </div>
              )}
              </div>
            ) : (
              <button className='loginButton' onClick={login}>
                Login
              </button>
            )}
                <img src='/images/logo.png' className='logo'></img>
                <form className='serch'>
                    <input placeholder='방검색' className='searchInput'></input>
                    <button className='roomSearch'>
                        serch
                    </button>
                </form>
            </div>
            <div className='contain'>
                <div className='createRoomContain'>
                    <div className='title'>Room Create</div>
                    <div className='createRoom'>
                        <p><input type='checkbox' onChange={() => setShowPassword(!showPassword)} />password</p>
                        <form onSubmit={handleCreateRoom}>
                        <p><input type='text' id="roomName" placeholder='roomname' className='inputField'></input></p>
                        {showPassword && <p><input type='password' id="password" placeholder='password' className='inputField'></input></p>}
                        <button className='createButton'>Create</button>
                        </form>
                    </div>
                </div>
                <div className='roomListContain'>
                    <div className='roomListHeader'>
                        <div className='headerText'>Room List</div>
                        <button className='refreshButton' onClick={refreshRoom}>Refresh</button> 
                    </div>

                    <div className='roomList'>
                    {rooms.map((room) => (
                    <div key={room.id}>
                      <RoomModal room={room} />
                    </div>
                  ))}                    
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default CreateRoom;