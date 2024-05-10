// App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import CreateRoom from "./components/CreateRoom";
import Game2 from "./components/allroom";
import Room from "./components/Room";
import LoginCheck from "./components/LoginCheck";
import "./styles/App.css";
import "./styles/game.css";
import "./styles/home.css";

/**
 * App 컴포넌트는 웹 애플리케이션의 메인 라우팅을 담당합니다.
 * 이 구성 요소는 사이트의 여러 페이지로의 라우팅을 관리합니다.
 */
function App() {
  const [user_name, setUserName] = useState(null);
  const [routes, setRoutes] = useState([]);
  
  const createRoom = (roomData) => {
    const newRoom = (
      <Route key={roomData.roomId} exact path={`/game/${roomData.roomId}`} element={<Game2 />} />
    );
    console.log(newRoom)
    setRoutes((prevRoutes) => [...prevRoutes, newRoom]);
  };
  
  return (
    <Router>
      <LoginCheck user_name={user_name} setUserName={setUserName}/>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/create-room" element={<CreateRoom user_name={user_name} createRoom={createRoom}/>} />
        <Route exact path="/room" element={<Room />} />
        <Route exact path="/game" element={<Game2 />} />
        {routes}
      </Routes>
    </Router>
  );
}

export default App;