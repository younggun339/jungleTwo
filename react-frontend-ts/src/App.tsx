import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import CreateRoom from "./components/CreateRoom";
import Game2 from "./components/Game2";
import Room from "./components/Room";
import LoginCheck from "./components/LoginCheck";
import "./styles/App.css";
import "./styles/game.css";
import "./styles/home.css";

/**
 * App 컴포넌트는 웹 애플리케이션의 메인 라우팅을 담당합니다.
 * 이 구성 요소는 사이트의 여러 페이지로의 라우팅을 관리합니다.
 */
const App: React.FC = () => {
  const [user_name, setUserName] = useState<string | null>(null);

  return (
    <Router>
      <LoginCheck setUserName={setUserName} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-room" element={<CreateRoom user_name={user_name} />} />
        <Route path="/game" element={<Game2 />} />
        <Route path="/room" element={<Room />} />
      </Routes>
    </Router>
  );
}

export default App;