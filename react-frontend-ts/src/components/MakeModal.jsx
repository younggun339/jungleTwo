import React, { useState } from 'react';
import Modal from 'react-modal';
import "../styles/modal.css"

const RoomModal = ({ room }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [result, setPasswordCorrect] = useState(false);

  const openModal = () => {
    if (room.room_pw === "") {
      window.location.assign("https://zzrot.store/game/"+room.room_id);
      return
    }
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleConfirm = () => {
    const password = document.getElementById('password').value;
    fetch("https://zzrot.store/room/check", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ room_id: room.room_id, room_pw: password }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.result) {
        window.location.assign("https://zzrot.store/game/"+room.room_id);
      } else {
        setMessage('잘못된 비밀번호입니다. 다시 시도해주세요.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      setMessage('서버 오류가 발생했습니다.');
    });
  };

  return (
    <div className='room'>
          {room.room_pw !== "" ? (
            <img src='/images/lock.png' style={{width:'70px',height:'70px',marginLeft:'20px'}}></img>
            ) : (
            <img src='/images/cheese.png' style={{width:'70px',height:'70px',marginLeft:'20px'}}></img>
          )}
          <div className='roomText'>
          <div className='roomName'>{room.room_name}</div>
          <div className='nickname'>{room.room_master}</div>
          <button className='go' onClick={openModal}>입장</button>
          </div>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal">
        <h2>방 정보</h2>
        <p>제목: {room.room_name}</p>
        <p>방장: {room.room_master}</p>
        <p>
          <input type="text" id='password'/>
          <button onClick={handleConfirm}>확인</button>
        </p>
        <p>{message}</p>
        {/* {result && <button onClick={closeModal}>닫기</button>} */}
      </Modal>
    </div>
  );
};

export default RoomModal;
