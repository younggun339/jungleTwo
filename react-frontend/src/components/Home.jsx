// Home.jsx
import React from "react";
import "../styles/home.css";
import { useNavigate } from "react-router-dom";

/**
 * Home displays the main login screen with options to log in via Kakao or Google.
 */
function Home() {
  const navigate = useNavigate(); // Initialize navigate using the useNavigate hook

  const handleKakaoLogin = () => {
    navigate('/auth/kakao/login'); // Use navigate to change the route
    window.location.reload();
  };

  const handleGoogleLogin = () => {
    navigate("/auth/google/login"); // Use navigate to change the route
    window.location.reload();
  };

  return (
    <div>
      <div className="wrapper">
        <div className="form-signin">
          <p>
            <img
            src="/images/lattadoit2.png"
            alt="Logo" className="Logo"/>
          </p>

          <img
            src="/images/kakao_login_large_narrow.png"
            alt="Kakao login"
            style={{ width: "130px", height: "auto", marginRight: "10px" }}
            onClick={handleKakaoLogin}
          />
          <img
            src="/images/web_light_sq_SU@2x.png"
            alt="Google login"
            style={{ width: "130px", height: "auto" }}
            onClick={handleGoogleLogin}
          />
          <img
            src="/images/cute.webp"
            alt="cute" className="Cute"
          />
        </div>
      </div>
    </div>
  );
}

export default Home;