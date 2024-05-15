import React, { useState, useEffect } from "react";

function SSE() {
  //   const [number, setNumber] = useState(0);

  //   useEffect(() => {
  //     const eventSource = new EventSource("https://zzrot.store/stream/");
  //     console.log("u");
  //     eventSource.onmessage = function (event) {
  //       console.log("hi");
  //       const data = JSON.parse(event.data);
  //       setNumber(data.number);
  //     };

  //     eventSource.onerror = function (error) {
  //       console.error("EventSource failed:", error);
  //       eventSource.close();
  //     };

  //     return () => {
  //       eventSource.close();
  //     };
  //   }, []);

  return (
    <div>
      <header>
        <p>Received number</p>
      </header>
    </div>
  );
}

export default SSE;
