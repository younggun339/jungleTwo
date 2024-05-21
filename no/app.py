from PIL import Image

# 이미지 파일 로드
sprite_sheet_path = './sprite/Pointer.png'
sprite_sheet = Image.open(sprite_sheet_path)
print(sprite_sheet.size)  # (96, 32

# 프레임 크기 설정
frame_width = 32
frame_height = 32

# 분할하여 각 프레임 저장
frames = []
for i in range(sprite_sheet.width // frame_width):
    left = i * frame_width
    upper = 0
    right = left + frame_width
    lower = upper + frame_height
    frame = sprite_sheet.crop((left, upper, right, lower))
    frame_path = f'./assets/Pointer_{i}.png'
    frame.save(frame_path)
    frames.append(frame_path)

frames  # 각 프레임 파일의 경로 반환