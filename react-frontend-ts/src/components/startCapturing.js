// startCapturing.js

/**
 * 비디오 스트림에서 이미지를 캡처하고, 이를 WebSocket을 통해 서버로 전송하는 함수.
 * 
 * @param {MediaStream} stream - 비디오 스트림 객체.
 * @param {React.RefObject} ref - 비디오 태그의 ref.
 * @param {React.RefObject} canvasRef - 캔버스 태그의 ref.
 * @param {Socket} socketRef - Socket.IO 클라이언트 인스턴스의 ref.
 */
const startCapturing = (stream, ref, canvasRef, socketRef, myIndex) => {
    const video = ref.current;
    const canvas = canvasRef.current;
  
    // 캔버스가 없다면 함수 종료
    if (!canvas) return;
  
    const context = canvas.getContext('2d');
  
    // 캔버스 크기를 비디오와 동일하게 설정
    const resizeCanvas = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    };
  
    // 비디오의 메타데이터가 로드되면 캔버스 크기 조정
    video.onloadedmetadata = resizeCanvas;
  
    // 윈도우 크기가 변경될 때 캔버스 크기 재설정
    window.addEventListener('resize', resizeCanvas);
  
    // 이미지를 주기적으로 캡처하고 WebSocket을 통해 전송
    const interval = setInterval(() => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // 캔버스에서 이미지를 Base64 문자열로 추출
        const imageData= canvas.toDataURL('image/jpeg');
  
        // 이미지 데이터를 서버로 전송
        if(myIndex.current === 0){
            socketRef.current.emit('image-capture-L', { image: imageData });
        }
        else {
            socketRef.current.emit('image-capture-R', { image: imageData });
        }
      }
    }, 500);
  
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  };
  
  export default startCapturing;