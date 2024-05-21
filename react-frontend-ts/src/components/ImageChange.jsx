import React, { useState, useEffect } from "react";
import Modal from "react-modal";

function MainImage() {
  const images = [
    "/images/info1.gif",
    "/images/info2.gif",
    "/images/info3.gif",
    "/images/info4.gif",
    "/images/info5.gif",
    "/images/info6.gif",
    "/images/info7.gif",
    "/images/info8.gif",
    "/images/info9.gif",
    "/images/info10.gif",
    "/images/info11.gif",
    "/images/info12.gif",
    "/images/info13.gif",
    "/images/info14.gif",
    "/images/info15.gif",
    "/images/info16.gif",
  ];
  const [currentImage, setCurrentImage] = useState(images[0]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleNextImage = () => {
    const currentIndex = images.indexOf(currentImage);
    const nextIndex = (currentIndex + 1) % images.length;
    setCurrentImage(images[nextIndex]);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <>
      <div className="mainImg">
        <img src="/images/ttreal.png" alt="" onClick={openModal} />
      </div>
      <Modal
        isOpen={modalIsOpen}
        className="imageModal"
        onRequestClose={closeModal}
      >
        <img src={currentImage} onClick={handleNextImage} />
      </Modal>
    </>
  );
}

export default MainImage;
