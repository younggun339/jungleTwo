from PIL import Image

def trim_whitespace(image):
    """이미지에서 불필요한 공백(배경)을 제거하는 함수"""
    # 이미지를 RGBA로 변환 (알파 채널이 있는 경우에만 공백을 정확하게 찾을 수 있음)
    image = image.convert("RGBA")
    
    # 이미지의 바운딩 박스를 계산
    bbox = image.getbbox()
    if bbox:
        return image.crop(bbox)
    return image

def combine_images(image_path):
    """이미지를 두 개 옆으로 결합하는 함수"""
    # 이미지를 불러온다
    img = Image.open(image_path)
    
    # 공백 배경 제거
    img_trimmed = trim_whitespace(img)

    # 결합할 새 이미지의 너비와 높이를 계산
    result_width = img_trimmed.width * 2
    result_height = img_trimmed.height
    
    # 새 이미지를 생성 (RGBA 모드로 투명 배경을 가짐)
    result_image = Image.new('RGBA', (result_width, result_height), (255, 255, 255, 0))

    # 원본 이미지를 결과 이미지에 붙인다
    result_image.paste(img_trimmed, (0, 0))
    result_image.paste(img_trimmed, (img_trimmed.width, 0))

    # 결과 이미지를 저장한다
    result_image.save('./combine/Spike.png')

    return './combine/Spike.png'

# 이미지 파일 경로 설정
image_path = './Spike3.png'  # 이미지 파일 경로

# 이미지 결합 함수 실행
output_path = combine_images(image_path)
print(f"Combined image saved at {output_path}")