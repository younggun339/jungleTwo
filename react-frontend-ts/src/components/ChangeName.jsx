import React, { useState } from 'react';
import Modal from 'react-modal';

const ChangeName = ({isOpen, closeModal}) => {
  const [message, setMessage] = useState('');

  const handleConfirm = () => {
    const newName = document.getElementById('name').value;
    fetch("https://zzrot.store/update", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({user_name:newName}),
    })
    .then(() => {
        window.location.reload();
    })
    .catch(error => {
      console.error('Error:', error);
      setMessage('서버 오류가 발생했습니다.');
    });
  };


  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal} className="modal">
      <h2>닉네임 변경</h2>
      <p>변경할 닉네임</p>
      <p>
        <input type="text" id='name'/>
        <button onClick={handleConfirm}>확인</button>
      </p>
      <p>{message}</p>
      {/* {<button onClick={closeModal}>닫기</button>} */}
    </Modal>
  );
};

export default ChangeName;