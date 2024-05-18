import React, { useState, useEffect } from 'react';

function MainImage() {
  const images = ['/images/aaa.jpg', '/images/bbb.jpg', '/images/aaa1.jpg'];
  const [currentImage, setCurrentImage] = useState(images[0]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentIndex = images.indexOf(currentImage);
      const nextIndex = (currentIndex + 1) % images.length;
      setCurrentImage(images[nextIndex]);
    }, 8000);

    return () => clearInterval(intervalId);
  }, [currentImage, images]);

  return (
    <div className="mainImg">
      <img src={currentImage} alt="" />
    </div>
  );
}

export default MainImage;