import React from "react";
import { useNavigate, NavigateFunction } from "react-router-dom";
import "../styles/home.css";

/**
 * Home displays the main login screen with options to log in via Kakao or Google.
 */
const Home: React.FC = () => {
  const navigate: NavigateFunction = useNavigate(); // Initialize navigate using the useNavigate hook

  const handleKakaoLogin = () => {
    navigate("/auth/kakao/login"); // Use navigate to change the route
    window.location.reload();
  };

  const handleGoogleLogin = () => {
    navigate("/auth/google/login"); // Use navigate to change the route
    window.location.reload();
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div className="wrapper">
        <div className="form-signin">
          <p>
            <img src="/images/lattadoit2.png" alt="Logo" />
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
          <img src="/images/cute.webp" alt="Logo" />
        </div>
      </div>
    </div>
  );
};

export default Home;