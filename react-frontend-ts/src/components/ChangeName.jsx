import React, { useState } from 'react';
import Modal from 'react-modal';

const ChangeName = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

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
    <div>
    <div onClick={openModal}>
    닉네임 변경
    </div>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal">
        <h2>닉네임변경</h2>
        <p>변경할 닉네임</p>
        <p>
          <input type="text" id='name'/>
          <button onClick={handleConfirm}>확인</button>
        </p>
        <p>{message}</p>
        {<button onClick={closeModal}>닫기</button>}
      </Modal>
    </div>
  );
};

export default ChangeName;
