# app.py
from flask import Flask, Response, request, jsonify, session
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import base64
from PIL import Image
import io
import time
import json
import numpy as np
import cv2
import mediapipe as mp
import logging

logging.basicConfig(level=logging.INFO)


app = Flask(__name__, static_folder='../react-frontend-ts/build', static_url_path='/')
socketio = SocketIO(app, cors_allowed_origins="*")
CORS(app, resources={r"/stream/*": {"origins": "*"}})  # Allow CORS for all domains

mpPose = mp.solutions.pose
mp_hands = mp.solutions.hands
pose = mpPose.Pose()
hands = mp_hands.Hands()

@socketio.on('flask-connect')
def handleConnect():
    print('Client connected')

def decode_image(image_data):
    nparr = np.frombuffer(image_data, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    return img

# @socketio.on('image-capture-L')
# def handle_image_capture(data):
#     print("Received image data")
#     # Base64 문자열에서 이미지 데이터 디코딩
#     # Base64 문자열에서 이미지 데이터 디코딩
#     image_data = data['image'].split(",")[1]  # "data:image/jpeg;base64," 부분 제거
#     # print("Decoded Image Data:", image_data[:100])  # 이미지 데이터가 매우 길 수 있으므로 처음 100자만 출력

#     image_bytes = base64.b64decode(image_data)
#     # print("Image Bytes:", image_bytes[:100])  # 바이트 데이터도 매우 길 수 있으므로 처음 100바이트만 출력

#     # BytesIO를 사용하여 이미지 열기
#     image = Image.open(io.BytesIO(image_bytes))
#     # print("Image Object:", image)

#     # PIL 이미지를 OpenCV 형식으로 변환
#     frame = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
#     # print("OpenCV Image Array:", frame)
#     # print("")

#     # Mediapipe로 포즈 분석
#     results = pose.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
#     if results.pose_landmarks:
#         # 특정 조인트 좌표 추출
#         joint1Start = results.pose_landmarks.landmark[mpPose.PoseLandmark.RIGHT_ELBOW]
#         joint1End = results.pose_landmarks.landmark[mpPose.PoseLandmark.RIGHT_WRIST]
#         # print("joint1Start:")
#         # print("  x:", joint1Start.x)
#         # print("  y:", joint1Start.y)
#         # print("joint1End:")
#         # print("  x:", joint1End.x)
#         # print("  y:", joint1End.y)

#         # 추출한 스켈레톤 정보를 클라이언트로 송신
#         socketio.emit('body-coords-L', {'joint1Start': {'x': joint1Start.x, 'y': joint1Start.y},
#                                'joint1End': {'x': joint1End.x, 'y': joint1End.y}})


# @socketio.on('image-capture-R')
# def handle_image_capture(data):
#     # print("Received image data")
#     image_data = data['image'].split(",")[1]  # "data:image/jpeg;base64," 부분 제거
#     # print("Decoded Image Data:", image_data[:100])  # 이미지 데이터가 매우 길 수 있으므로 처음 100자만 출력

#     image_bytes = base64.b64decode(image_data)
#     # print("Image Bytes:", image_bytes[:100])  # 바이트 데이터도 매우 길 수 있으므로 처음 100바이트만 출력

#     # BytesIO를 사용하여 이미지 열기
#     image = Image.open(io.BytesIO(image_bytes))
#     # print("Image Object:", image)

#     # PIL 이미지를 OpenCV 형식으로 변환
#     frame = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
#     # print("OpenCV Image Array:", frame)
#     # Mediapipe로 포즈 분석
#     results = hands.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
#     if results.multi_hand_landmarks:
#         for hand_landmarks, handedness in zip(results.multi_hand_landmarks, results.multi_handedness):
#             if handedness.classification[0].label == 'Left':
#                 wrist = hand_landmarks.landmark[mp_hands.HandLandmark.WRIST]
#                 middle_finger_mcp = hand_landmarks.landmark[mp_hands.HandLandmark.MIDDLE_FINGER_MCP]
#                 middle_finger_tip = hand_landmarks.landmark[mp_hands.HandLandmark.MIDDLE_FINGER_TIP]
                
#                 socketio.emit('body-coords-R', {
#                     'joint1': {'x': wrist.x, 'y': wrist.y}, 
#                     'joint2': {'x': middle_finger_mcp.x, 'y': middle_finger_mcp.y},
#                     'joint3': {'x': middle_finger_tip.x, 'y': middle_finger_tip.y},
#                 })



def generate_numbers():
    count = 0
    while True:
        count += 1
        data = json.dumps({"number": count})
        print(f"data: {data}\n\n")  
        yield f"data: {data}\n\n"
        time.sleep(1)

@app.route('/stream/')
def stream():
    print("streaming", flush=True)
    return Response(stream_results(), mimetype='text/event-stream')

data_store = {}  # 데이터 스토어로 분석 결과를 저장

def stream_results():
    """스트림 생성 함수. 클라이언트에게 실시간 데이터를 전송."""
    while True:
        if data_store:
            data = json.dumps(data_store)
            yield f'data: {data}\n\n'
            data_store.clear()  # 데이터 전송 후 클리어
        time.sleep(1)  # 데이터 확인 주기

@app.route('/image-capture-R', methods=['POST'])
def handle_image_capture():
    print("Received image data")
    content = request.json
    image_data = content['image'].split(",")[1]
    image_bytes = base64.b64decode(image_data)
    image = Image.open(io.BytesIO(image_bytes))
    frame = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
    print("Image Object:", image)
    # 이미지 분석
    results = pose.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
    if results.pose_landmarks:
        joint1Start = results.pose_landmarks.landmark[mpPose.PoseLandmark.RIGHT_ELBOW]
        joint1End = results.pose_landmarks.landmark[mpPose.PoseLandmark.RIGHT_WRIST]
        # 분석 결과를 데이터 스토어에 저장
        print(joint1Start)
        data_store['body-coords-L'] = {
            'joint1Start': {'x': joint1Start.x, 'y': joint1Start.y},
            'joint1End': {'x': joint1End.x, 'y': joint1End.y}
        }
    return jsonify(success=True)        

if __name__ == "__main__":
    app.run(app, debug=True, ssl_context=('cert.pem', 'key.pem'), threaded=False)