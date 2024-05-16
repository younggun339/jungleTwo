# app.py
from flask import Flask, Response, request, jsonify, session
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import base64
from PIL import Image
import io
import time
import numpy as np
import cv2
import mediapipe as mp


app = Flask(__name__, static_folder='../react-frontend-ts/build', static_url_path='/')
socketio = SocketIO(app, cors_allowed_origins="*")
CORS(app)  # Allow CORS for all domains

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

@socketio.on('image-capture-L')
def handle_image_capture(data):
    print("Received image data")
    # Base64 문자열에서 이미지 데이터 디코딩
    # Base64 문자열에서 이미지 데이터 디코딩
    image_data = data['image'].split(",")[1]  # "data:image/jpeg;base64," 부분 제거
    # print("Decoded Image Data:", image_data[:100])  # 이미지 데이터가 매우 길 수 있으므로 처음 100자만 출력

    image_bytes = base64.b64decode(image_data)
    # print("Image Bytes:", image_bytes[:100])  # 바이트 데이터도 매우 길 수 있으므로 처음 100바이트만 출력

    # BytesIO를 사용하여 이미지 열기
    image = Image.open(io.BytesIO(image_bytes))
    # print("Image Object:", image)

    # PIL 이미지를 OpenCV 형식으로 변환
    frame = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
    # print("OpenCV Image Array:", frame)
    # print("")
    # Mediapipe로 포즈 분석
    results = pose.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
    if results.pose_landmarks:
        # 특정 조인트 좌표 추출
        joint1Start = results.pose_landmarks.landmark[mpPose.PoseLandmark.LEFT_ELBOW]
        joint1End = results.pose_landmarks.landmark[mpPose.PoseLandmark.LEFT_WRIST]
        # print("joint1Start:")
        # print("  x:", joint1Start.x)
        # print("  y:", joint1Start.y)
        # print("joint1End:")
        # print("  x:", joint1End.x)
        # print("  y:", joint1End.y)

        # 추출한 스켈레톤 정보를 클라이언트로 송신
        socketio.emit('body-coords-L', {'joint1Start': {'x': joint1Start.x, 'y': joint1Start.y},
                               'joint1End': {'x': joint1End.x, 'y': joint1End.y}})



@socketio.on('image-capture-R')
def handle_image_capture(data):
    print("Received image data")
    # Base64 문자열에서 이미지 데이터 디코딩
    # Base64 문자열에서 이미지 데이터 디코딩
    image_data = data['image'].split(",")[1]  # "data:image/jpeg;base64," 부분 제거
    # print("Decoded Image Data:", image_data[:100])  # 이미지 데이터가 매우 길 수 있으므로 처음 100자만 출력

    image_bytes = base64.b64decode(image_data)
    # print("Image Bytes:", image_bytes[:100])  # 바이트 데이터도 매우 길 수 있으므로 처음 100바이트만 출력

    # BytesIO를 사용하여 이미지 열기
    image = Image.open(io.BytesIO(image_bytes))
    # print("Image Object:", image)

    # PIL 이미지를 OpenCV 형식으로 변환
    frame = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
    # print("OpenCV Image Array:", frame)
    # print("")

    # Mediapipe로 포즈 분석
    results = pose.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
    if results.pose_landmarks:
        # 특정 조인트 좌표 추출
        joint1Start = results.pose_landmarks.landmark[mpPose.PoseLandmark.RIGHT_ELBOW]
        joint1End = results.pose_landmarks.landmark[mpPose.PoseLandmark.RIGHT_WRIST]
        # print("joint1Start:")
        # print("  x:", joint1Start.x)
        # print("  y:", joint1Start.y)
        # print("joint1End:")
        # print("  x:", joint1End.x)
        # print("  y:", joint1End.y)

        # 추출한 스켈레톤 정보를 클라이언트로 송신
        socketio.emit('body-coords-R', {'joint1Start': {'x': joint1Start.x, 'y': joint1Start.y},
                               'joint1End': {'x': joint1End.x, 'y': joint1End.y}})


# @socketio.on('image-capture-R')
# def handle_image_capture(data):
#     print("Received image data")
#     image_data = data['image'].split(",")[1]  # "data:image/jpeg;base64," 부분 제거
#     print("Decoded Image Data:", image_data[:100])  # 이미지 데이터가 매우 길 수 있으므로 처음 100자만 출력

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


if __name__ == "__main__":
    socketio.run(app, debug=True, port=5000)