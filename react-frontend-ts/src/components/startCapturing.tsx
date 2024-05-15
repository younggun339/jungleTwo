import { RefObject } from "react";
import { Socket } from "socket.io-client";

/**
 * 비디오 스트림에서 이미지를 캡처하고, 이를 WebSocket을 통해 서버로 전송하는 함수.
 *
 * @param stream - 비디오 스트림 객체.
 * @param videoRef - 비디오 태그의 ref.
 * @param canvasRef - 캔버스 태그의 ref.
 * @param socketRef - Socket.IO 클라이언트 인스턴스의 ref.
 * @param myIndex - 현재 사용자의 인덱스를 나타내는 ref.
 * @returns 정리 함수 (캡처 중지를 위해 호출)
 */
const startCapturing = (
  stream: MediaStream,
  videoRef: RefObject<HTMLVideoElement>,
  canvasRef: RefObject<HTMLCanvasElement>,
  socketRef: RefObject<Socket | null>,
  myIndex: RefObject<number>
): (() => void) => {
  const video = videoRef.current;
  const canvas = canvasRef.current;
  console.log("video: ", video);
  // 캔버스가 없다면 함수 종료
  if (!canvas || !video) return () => {};

  const context = canvas.getContext("2d");

  if (!context) return () => {};

  // 캔버스 크기를 비디오와 동일하게 설정
  const resizeCanvas = () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  };

  // 비디오의 메타데이터가 로드되면 캔버스 크기 조정
  video.onloadedmetadata = resizeCanvas;

  // 윈도우 크기가 변경될 때 캔버스 크기 재설정
  window.addEventListener("resize", resizeCanvas);

  // 이미지를 주기적으로 캡처하고 WebSocket을 통해 전송
  const interval = setInterval(() => {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      //     // 캔버스에서 이미지를 Base64 문자열로 추출
      //     const imageData = canvas.toDataURL("image/jpeg");
      //     console.log(imageData.slice(0, 100) + "...");

      //     // 이미지 데이터를 서버로 전송 (socketRef.current가 null이 아닌지 확인)
      //     if (socketRef.current) {
      //       if (myIndex.current === 0) {
      //         socketRef.current.emit("image-capture-R", { image: imageData });
      //       } else {
      //         socketRef.current.emit("image-capture-L", { image: imageData });
      //       }
      //     }
      //   }
      // }, 500);

      // 캔버스에서 이미지를 Base64 문자열로 추출
      const imageData = canvas.toDataURL("image/jpeg");
      console.log(imageData.slice(0, 100) + "...");
      // 서버로 이미지 데이터 전송
      const url =
        myIndex.current === 0 ? "/image-capture-R" : "/image-capture-R";
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageData }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Image sent successfully:", data);
        })
        .catch((error) => {
          console.error("Error sending image:", error);
        });
    }
  }, 500);

  return () => {
    clearInterval(interval);
    window.removeEventListener("resize", resizeCanvas);
  };
};

export default startCapturing;
