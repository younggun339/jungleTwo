import React, { useState } from "react";
import { useNavigate, NavigateFunction } from "react-router-dom";
import "../styles/home.css";
import useAudio from "../hooks/useAudio";
import useSoundEffects from "../hooks/useSoundEffects";

/**
 * Home displays the main login screen with options to log in via Kakao or Google.
 */
const Home: React.FC = () => {
  const navigate: NavigateFunction = useNavigate(); // Initialize navigate using the useNavigate hook
  const { play, changeSource, setLoop } = useAudio({
    initialSrc: "/music/wait1.mp3",
  });
  const playSound = useSoundEffects();
  setLoop(false);
  const handleKakaoLogin = () => {
    navigate("/auth/kakao/login"); // Use navigate to change the route
    window.location.reload();
  };

  const handleGoogleLogin = () => {
    navigate("/auth/google/login"); // Use navigate to change the route
    window.location.reload();
  };

  return (
    <>
      <div className="animated-background"></div>
      <div className="main-content" style={{ textAlign: "center" }}>
        <div className="wrapper">
          <div className="form-signin">
            <img src="/images/Rattus.webp" className="homeLogo" />
            <div className="hello">환영합니다!</div>
            <img
              src="/images/kakao_login_large_narrow.png"
              alt="Kakao login"
              style={{ width: "200px", height: "auto", marginRight: "10px" }}
              onClick={handleKakaoLogin}
            />
            <img
              src="/images/web_light_sq_SU@2x.png"
              alt="Google login"
              style={{ width: "200px", height: "auto", marginRight: "10px" }}
              onClick={handleGoogleLogin}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
