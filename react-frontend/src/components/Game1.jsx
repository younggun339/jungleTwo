// Game1.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Engine, Events, Body } from 'matter-js';
import useMatterSetupContinuity from '../hooks/useMatterSetupContinuity';
import '../styles/game.css';

function Game1() {
  const sceneRef = useRef(null);
  const videoRef = useRef(null);
  const engineRef = useRef(Engine.create());
  const leftArmRef = useRef(null);
  const rightArmRef = useRef(null);
  const circleRef = useRef(null);

  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isIngameStarted, setIsIngameStarted] = useState(false);
  const [setIsGoalReached] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useMatterSetupContinuity({ sceneRef, videoRef, engineRef, leftArmRef, rightArmRef, circleRef }, setIsGoalReached, setIsGameStarted, setIsIngameStarted);

  // Countdown
  useEffect(() => {
    if (isIngameStarted && countdown > 0) {
      const interval = setInterval(() => {
        setCountdown(prevCount => prevCount - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (countdown === 0) {
      setIsGameStarted(true);
      setCountdown(null);
    }
  }, [isIngameStarted, countdown]);

  // Apply continuous force to the mouse
  useEffect(() => {
    const applyContinuousForce = () => {
      Body.applyForce(circleRef.current, circleRef.current.position, { x: 0.01, y: 0 });
      Body.setAngularVelocity(circleRef.current, 0);
    };

    if (isGameStarted) {
      leftArmRef.current.collisionFilter.mask = 0xFFFF;
      rightArmRef.current.collisionFilter.mask = 0xFFFF;
      Body.setStatic(circleRef.current, false);
      Events.on(engineRef.current, 'beforeUpdate', applyContinuousForce);
    }

    return () => {
      Events.off(engineRef.current, 'beforeUpdate', applyContinuousForce);
    };
  }, [isGameStarted]);

  // Sprite animation
  const [spriteIndex, setSpriteIndex] = useState(0);
  const sprites = [
    '/assets/mouse_stand_001.png',
    '/assets/mouse_stand_002.png',
    '/assets/mouse_stand_003.png',
    '/assets/mouse_stand_004.png'
  ];
  // Animate mouse sprite every 250ms
  useEffect(() => {
    if (isGameStarted) {
      const interval = setInterval(() => {
        setSpriteIndex((current) => {
          const nextIndex = (current + 1) % sprites.length;
          const newTexture = `${sprites[nextIndex]}?v=${Date.now()}`;
          Body.set(circleRef.current, 'render.sprite.texture', newTexture);
          return nextIndex;
        });
      }, 250);
  
      return () => clearInterval(interval);
    }
  }, [isGameStarted]);

  const startGame = () => {
    setIsGoalReached(false);
    setCountdown(3);
    setIsIngameStarted(true);
  };

  return (
    <div className="App">
      <div id="matter-container" ref={sceneRef}></div>
      <div id="video-container">
        <img
          ref={videoRef}
          src="/video-feed"
          alt="Video Feed"
          onLoad={() => setIsImageLoaded(true)}
          onError={() => alert('Failed to load video feed.')}
        />
      </div>
      {isIngameStarted && countdown > 0 && <div id="countdown">{countdown}</div>}
      {!isIngameStarted && isImageLoaded && (
        <button onClick={startGame} id="start-button">Start Game</button>
      )}
      {!isImageLoaded && <div id="loading-overlay">Loading...</div>}
    </div>
  );
}

export default Game1;
