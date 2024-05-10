import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";

function Room() {
  const [time, setTime] = useState({ minutes: 1, seconds: 0 }); // 분과 초를 상태로 관리
  const [isReady, setIsReady] = useState(true); // 준비 상태를 나타내는 상태

  const handleStart = () => {
    setIsReady(false); // 준비 상태 변경
  };

  useEffect(() => {
    // 클릭하여 준비되었을 때만 타이머 시작
    if (!isReady) {
      const interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime.seconds === 0 && prevTime.minutes === 0) {
            clearInterval(interval); // 타이머가 0에 도달하면 타이머 중지
            return prevTime;
          } else if (prevTime.seconds === 0) {
            return { minutes: prevTime.minutes - 1, seconds: 59 }; // 1분 감소, 초 초기화
          } else {
            return { ...prevTime, seconds: prevTime.seconds - 1 }; // 1초 감소
          }
        });
      }, 1000);

      // 컴포넌트가 언마운트되면 interval을 정리하여 메모리 누수 방지
      return () => clearInterval(interval);
    }
  }, [isReady]); // isReady 상태가 변경될 때마다 useEffect 재실행

  // 분과 초를 정수로 받아서 시간 형식으로 변환하는 함수
  const formatTime = (minutes, seconds) => {
    return `${String(minutes).padStart(2, "0")} : ${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <div>
      {/* 준비되었을 때만 네모 창 표시 */}
      {isReady && (
        <div className="click-box" onClick={handleStart}>
          준비가 완료되면 클릭하세요.
        </div>
      )}
      <div className="round">2</div>
      <div className="container">
        <div className="box"></div>
        <div className="box"></div>
      </div>
      <div className="timer">{formatTime(time.minutes, time.seconds)}</div>{" "}
      {/* 카운트 다운 표시 */}
      <Link to={"/"}>
        <button
          className="btn btn-lg btn-primary btn-block"
          style={{ marginLeft: "10%", marginTop: "10px", fontWeight: "bold" }}
        >
          뒤로 가기
        </button>
      </Link>
    </div>
  );
}

export default Room;
