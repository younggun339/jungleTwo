import React, { useEffect, useRef } from "react";

function Wse() {
  const fflaskSocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // WebSocket 연결 초기화
    fflaskSocketRef.current = new WebSocket("wss://zzrot.store/stream/");

    fflaskSocketRef.current.onopen = () => {
      console.log("WebSocket Connected");
    };

    fflaskSocketRef.current.onmessage = (event) => {
      console.log("Message from server ", event.data);
    };

    fflaskSocketRef.current.onclose = () => {
      console.log("WebSocket Disconnected");
    };

    fflaskSocketRef.current.onerror = (event) => {
      console.error("WebSocket Error ", event);
    };

    // Cleanup function
    return () => {
      fflaskSocketRef.current?.close();
    };
  }, []);

  return (
    <div>
      <header>
        <p>Received number</p>
      </header>
    </div>
  );
}

export default Wse;
