import React, { useState, useEffect } from "react";
import "../styles/room.css";
import RoomModal from "./MakeModal";
import ChangeName from "./ChangeName";
import MainImage from "./ImageChange";
import useAudio from "../hooks/useAudio";
import useSoundEffects from "../hooks/useSoundEffects";


const CreateRoom = ({ userName }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const images = ["/images/image1.gif", "/images/image.gif"];
  const [currentImage, setCurrentImage] = useState(images[0]);
  const isLoggedIn = userName !== null;
  const { play, changeSource, setLoop } = useAudio({
    initialSrc: "/music/lobby_BGM.mp3",
  });
  setLoop(true);
  
  const handleCreateRoom = (event) => {
    event.preventDefault(); // 기본 제출 행동 방지

    const generateRandomString = (num) => {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      let result = "";
      const charactersLength = characters.length;
      for (let i = 0; i < num; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }

      return result;
    };

    if (userName === null) {
      alert("로그인하지 않은 유저입니다.");
      return;
    }

    const newRoomId = generateRandomString(8);
    const roomName = event.currentTarget.elements.roomName.value;

    if (roomName === "") {
      alert("방 제목을 입력하세요.");
      return;
    }
    let passWord = null;
    if (showPassword) {
      passWord = event.currentTarget.elements.password.value;
      if (passWord === "") {
        document.getElementById("roomName").value = "";
        alert("비밀번호를 입력하세요.");
        return;
      }
    }

    fetch("https://zzrot.store/room/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        room_id: newRoomId,
        room_name: roomName,
        room_master: userName,
        room_pw: passWord,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          window.location.assign("https://zzrot.store/game/" + newRoomId);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    document.getElementById("roomName").value = "";
    if (showPassword) {
      document.getElementById("password").value = "";
    }
  };

  const refreshRoom = () => {
    fetch("https://zzrot.store/room/get")
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

  const logout = () => {
    fetch("https://zzrot.store/logout")
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const login = () => {
    window.location.assign("https://zzrot.store/");
  };

  const searchRoom = (event) => {
    const search = document.getElementById("search").value;
    event.preventDefault();
    fetch("https://zzrot.store/room/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ room_name: search }),
    })
      .then((response) => response.json())
      .then((data) => {
        setRooms(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const openModal = () => {
    setModalIsOpen(true);
  };
  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div>
      <div className="totalContain">
        <div className="header">
          {isLoggedIn ? (
            <div className="profile">
              <img src="/images/profile.png" />
              {userName}
              <div className="menu">
                <ul>
                  <li
                    onClick={(event) => {
                      event.stopPropagation();
                      openModal();
                    }}
                  >
                    닉네임 변경
                    <ChangeName isOpen={modalIsOpen} closeModal={closeModal} />
                  </li>
                  <li onClick={logout}>로그아웃</li>
                </ul>
              </div>
            </div>
          ) : (
            <button className="loginButton" onClick={login}>
              Login
            </button>
          )}
          <img src="/images/Rattus.webp" className="logo"></img>
          <form className="search" onSubmit={searchRoom}>
            <input
              placeholder="방 검색"
              className="searchInput"
              id="search"
            ></input>
            <button className="roomSearch">search</button>
          </form>
        </div>
        <div className="contain">
          <div className="createRoomContain">
            <div className="title">방 생성</div>
            <div className="createRoom">
              <p>
                <input
                  type="checkbox"
                  onChange={() => setShowPassword(!showPassword)}
                />
                비밀번호
              </p>
              <form onSubmit={handleCreateRoom}>
                <input
                  type="text"
                  id="roomName"
                  placeholder="방 제목"
                  className="inputField"
                ></input>
                {showPassword && (
                  <input
                    type="password"
                    id="password"
                    placeholder="비밀번호"
                    className="inputField"
                  ></input>
                )}
                <button className="createButton">Create</button>
              </form>
            </div>
            <div>
              <MainImage />
            </div>
          </div>
          <div className="roomListContain">
            <div className="roomListHeader">
              <div className="headerText">방 목록</div>
              <button className="refreshButton" onClick={refreshRoom}>
                Refresh
              </button>
            </div>

            <div className="roomList">
              {rooms.map((room) => (
                <div key={room.id} className="roomListDiv">
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
