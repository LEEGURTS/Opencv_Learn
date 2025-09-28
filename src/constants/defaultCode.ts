// 기본 Python 코드 템플릿
export const DEFAULT_PYTHON_CODE = `import cv2
import numpy as np
import image_utils

# 기본 이미지 생성 - 더 시각적으로 명확하게
img = np.zeros((480, 640, 3), dtype=np.uint8)

# 배경을 파란색으로 설정
img[:] = [100, 50, 200]  # BGR 형식

# 녹색 사각형 그리기
cv2.rectangle(img, (100, 100), (540, 380), (0, 255, 0), 3)

# 빨간색 원 그리기
cv2.circle(img, (320, 240), 80, (0, 0, 255), -1)

# 흰색 텍스트 추가
cv2.putText(img, 'OpenCV Python', (150, 200), cv2.FONT_HERSHEY_SIMPLEX, 1.5, (255, 255, 255), 2)
cv2.putText(img, 'Hello World!', (200, 300), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)

# 이미지를 캔버스에 표시
show_image(img)
print("기본 이미지가 생성되었습니다!")`;

// 간단한 테스트 코드
export const SIMPLE_TEST_CODE = `import cv2
import numpy as np
import image_utils

# 간단한 테스트 이미지
img = np.zeros((300, 400, 3), dtype=np.uint8)
img[:] = [50, 100, 150]  # 회색 배경

# 빨간색 원
cv2.circle(img, (200, 150), 50, (0, 0, 255), -1)

# 텍스트
cv2.putText(img, 'Test', (150, 250), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)

# 캔버스에 표시
image_utils.showImage(img, "result-canvas")
print("테스트 이미지 생성 완료!")`;
