import cv2
import numpy as np

def remove_black_background(input_image_path, output_image_path):
    # 이미지를 읽어온다
    image = cv2.imread(input_image_path, cv2.IMREAD_UNCHANGED)
    
    # 이미지가 RGBA 포맷이 아니라면 변환한다
    if image.shape[2] < 4:
        image = cv2.cvtColor(image, cv2.COLOR_BGR2BGRA)
    
    # 검은 배경을 찾기 위한 임계값 설정 (0, 0, 0, 255)
    lower = np.array([0, 0, 0, 0], dtype="uint8")
    upper = np.array([50, 50, 50, 255], dtype="uint8")

    # 검은색 영역에 해당하는 마스크 생성
    black_mask = cv2.inRange(image, lower, upper)

    # 마스크에서 검은색 영역은 0으로, 그 외는 255로 설정
    image[black_mask == 255] = (0, 0, 0, 0)
    
    # 결과 이미지 저장
    cv2.imwrite(output_image_path, image)

# 사용 예시
remove_black_background('./Pointer_0.png', './Pointer_0.png')
