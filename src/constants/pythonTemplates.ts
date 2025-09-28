export const PYTHON_TEMPLATES = {
  basic: `import cv2
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
print("기본 이미지가 생성되었습니다!")`,

  faceDetection: `import cv2
import numpy as np
import image_utils

# 얼굴 인식기 로드
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# 샘플 이미지 생성 (실제로는 업로드된 이미지 사용)
img = np.zeros((480, 640, 3), dtype=np.uint8)
cv2.rectangle(img, (200, 150), (400, 350), (255, 255, 255), -1)  # 얼굴 모양
cv2.circle(img, (250, 200), 20, (0, 0, 0), -1)  # 왼쪽 눈
cv2.circle(img, (350, 200), 20, (0, 0, 0), -1)  # 오른쪽 눈
cv2.ellipse(img, (300, 280), (50, 30), 0, 0, 180, (0, 0, 0), 2)  # 입

# 그레이스케일 변환
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# 얼굴 검출
faces = face_cascade.detectMultiScale(gray, 1.1, 4)

# 검출된 얼굴에 사각형 그리기
for (x, y, w, h) in faces:
    cv2.rectangle(img, (x, y), (x+w, y+h), (0, 255, 0), 2)

# 결과 이미지를 캔버스에 표시
show_image(img)
print(f"검출된 얼굴 수: {len(faces)}")`,

  imageFilters: `import cv2
import numpy as np
import image_utils

# 샘플 이미지 생성
img = np.random.randint(0, 255, (480, 640, 3), dtype=np.uint8)

# 다양한 필터 적용
blur = cv2.GaussianBlur(img, (15, 15), 0)
median = cv2.medianBlur(img, 15)
bilateral = cv2.bilateralFilter(img, 15, 80, 80)

# 결과를 하나의 이미지로 합치기 (가로로 연결)
result = np.hstack([img, blur, median, bilateral])

# 결과 이미지를 캔버스에 표시
show_image(result)
print("다양한 필터가 적용되었습니다!")`,

  edgeDetection: `import cv2
import numpy as np
import image_utils

# 샘플 이미지 생성
img = np.zeros((480, 640, 3), dtype=np.uint8)
cv2.circle(img, (320, 240), 100, (255, 255, 255), -1)
cv2.rectangle(img, (200, 150), (440, 330), (128, 128, 128), 3)

# 그레이스케일 변환
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# 엣지 검출
edges_canny = cv2.Canny(gray, 50, 150)
edges_sobelx = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
edges_sobely = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)

# 결과를 하나의 이미지로 합치기
result = np.hstack([gray, edges_canny, np.abs(edges_sobelx), np.abs(edges_sobely)])

# 결과 이미지를 캔버스에 표시
show_image(result)
print("엣지 검출이 완료되었습니다!")`,

  colorSpace: `import cv2
import numpy as np
import image_utils

# 샘플 이미지 생성 (그라데이션)
img = np.zeros((480, 640, 3), dtype=np.uint8)
for i in range(640):
    img[:, i] = [i//2, 128, 255-i//2]

# 다양한 색상 공간으로 변환
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# 결과를 하나의 이미지로 합치기
result = np.hstack([img, hsv, lab, cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)])

# 결과 이미지를 캔버스에 표시
show_image(result)
print("색상 공간 변환이 완료되었습니다!")`,

  numpyArray: `import cv2
import numpy as np

# numpy 배열로 직접 이미지 생성
# 1. 그레이스케일 이미지 (2D 배열)
gray_img = np.random.randint(0, 255, (300, 400), dtype=np.uint8)
show_image(gray_img)

# 2. 컬러 이미지 (3D 배열)
color_img = np.random.randint(0, 255, (300, 400, 3), dtype=np.uint8)
show_image(color_img)

# 3. float 배열 (0-1 범위)
float_img = np.random.rand(300, 400, 3)
show_image(float_img)

# 4. 수학적 함수로 생성한 이미지
x = np.linspace(0, 4*np.pi, 400)
y = np.linspace(0, 4*np.pi, 300)
X, Y = np.meshgrid(x, y)
Z = np.sin(X) * np.cos(Y)
# 0-1 범위를 0-255로 변환
math_img = ((Z + 1) / 2 * 255).astype(np.uint8)
show_image(math_img)

print("numpy 배열로 생성된 다양한 이미지들이 표시되었습니다!")`,

  opencvMat: `import cv2
import numpy as np

# OpenCV Mat 객체로 직접 이미지 생성
# 1. 빈 Mat 객체 생성
mat1 = cv2.Mat()
mat1 = np.zeros((300, 400, 3), dtype=np.uint8)
cv2.rectangle(mat1, (50, 50), (350, 250), (0, 255, 0), 2)
show_image(mat1)

# 2. Mat 객체에 그리기
mat2 = cv2.Mat()
mat2 = np.zeros((300, 400, 3), dtype=np.uint8)
cv2.circle(mat2, (200, 150), 80, (255, 0, 0), -1)
cv2.putText(mat2, 'OpenCV Mat', (100, 200), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
show_image(mat2)

# 3. Mat 객체 변환
mat3 = cv2.Mat()
mat3 = np.random.randint(0, 255, (300, 400, 3), dtype=np.uint8)
# 그레이스케일로 변환
gray_mat = cv2.cvtColor(mat3, cv2.COLOR_BGR2GRAY)
# 다시 컬러로 변환
color_mat = cv2.cvtColor(gray_mat, cv2.COLOR_GRAY2BGR)
show_image(color_mat)

print("OpenCV Mat 객체로 생성된 이미지들이 표시되었습니다!")`,

  videoProcessing: `import cv2
import numpy as np
import time

# 비디오 처리 예시 - 프레임별 처리
def process_video_frames():
    """비디오 프레임을 시뮬레이션하여 처리"""
    
    # 가상의 비디오 프레임 생성 (실제로는 비디오 파일에서 읽어옴)
    for frame_num in range(10):  # 10프레임 시뮬레이션
        # 새로운 프레임 생성
        frame = np.zeros((480, 640, 3), dtype=np.uint8)
        
        # 프레임 번호에 따라 다른 내용 그리기
        if frame_num < 3:
            # 초기 프레임: 원 그리기
            cv2.circle(frame, (320, 240), 50 + frame_num * 10, (0, 255, 0), 2)
            cv2.putText(frame, f'Frame {frame_num + 1}', (50, 50), 
                       cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
        elif frame_num < 6:
            # 중간 프레임: 사각형 그리기
            cv2.rectangle(frame, (100, 100), (540, 380), (255, 0, 0), 3)
            cv2.putText(frame, f'Frame {frame_num + 1}', (50, 50), 
                       cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
        else:
            # 마지막 프레임: 복합 도형
            cv2.circle(frame, (320, 240), 80, (0, 0, 255), -1)
            cv2.rectangle(frame, (200, 150), (440, 330), (255, 255, 0), 2)
            cv2.putText(frame, f'Frame {frame_num + 1}', (50, 50), 
                       cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
        
        # 프레임을 캔버스에 표시
        show_image(frame)
        
        # 프레임 간 지연 (실제 비디오에서는 필요 없음)
        time.sleep(0.5)
        
        print(f"프레임 {frame_num + 1} 처리 완료")

# 비디오 처리 실행
process_video_frames()
print("비디오 처리 시뮬레이션이 완료되었습니다!")`,

  realVideoProcessing: `import cv2
import numpy as np

# 실제 비디오 파일 처리 예시
def process_video_file():
    """비디오 파일을 프레임별로 처리"""
    
    # 실제 비디오 파일이 있다면 이렇게 처리:
    # cap = cv2.VideoCapture('video.mp4')
    
    # 시뮬레이션을 위해 가상의 비디오 프레임 생성
    print("비디오 파일을 열고 있습니다...")
    
    # 가상의 비디오 프레임들 생성 (실제로는 cap.read()로 읽어옴)
    for frame_num in range(15):  # 15프레임 시뮬레이션
        # 새로운 프레임 생성 (실제로는 cap.read()로 읽어옴)
        frame = np.random.randint(0, 255, (480, 640, 3), dtype=np.uint8)
        
        # 프레임에 노이즈 추가 (실제 비디오처럼)
        noise = np.random.randint(-30, 30, frame.shape, dtype=np.int16)
        frame = np.clip(frame.astype(np.int16) + noise, 0, 255).astype(np.uint8)
        
        # 프레임 번호에 따라 다른 필터 적용
        if frame_num < 5:
            # 블러 필터
            frame = cv2.GaussianBlur(frame, (15, 15), 0)
            cv2.putText(frame, 'Blur Filter', (50, 50), 
                       cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
        elif frame_num < 10:
            # 엣지 검출
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            edges = cv2.Canny(gray, 50, 150)
            frame = cv2.cvtColor(edges, cv2.COLOR_GRAY2BGR)
            cv2.putText(frame, 'Edge Detection', (50, 50), 
                       cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
        else:
            # 색상 변환
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
            frame = cv2.cvtColor(frame, cv2.COLOR_HSV2BGR)
            cv2.putText(frame, 'Color Transform', (50, 50), 
                       cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
        
        # 프레임 번호 표시
        cv2.putText(frame, f'Frame {frame_num + 1}/15', (50, 450), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
        
        # 프레임을 캔버스에 표시
        show_image(frame)
        
        print(f"프레임 {frame_num + 1} 처리 완료")
    
    print("비디오 처리가 완료되었습니다!")

# 비디오 처리 실행
process_video_file()`,

  webcamProcessing: `import cv2
import numpy as np
import base64
from io import BytesIO
from PIL import Image

# 웹캠 이미지 처리 예시
def process_webcam_image():
    """웹캠에서 캡처된 실제 이미지를 처리"""
    
    # 업로드된 이미지가 있는지 확인
    if 'uploaded_image_data' in globals() and uploaded_image_data:
        print("웹캠 이미지를 받았습니다!")
        
        try:
            # Base64 데이터에서 이미지 추출
            if uploaded_image_data.startswith('data:image'):
                # data:image/jpeg;base64, 부분 제거
                base64_data = uploaded_image_data.split(',')[1]
            else:
                base64_data = uploaded_image_data
            
            # Base64를 바이트로 디코딩
            image_bytes = base64.b64decode(base64_data)
            
            # PIL Image로 변환
            pil_image = Image.open(BytesIO(image_bytes))
            
            # OpenCV 형식으로 변환 (RGB -> BGR)
            img = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
            
            print(f"이미지 크기: {img.shape}")
            
            # 1. 원본 이미지 표시
            show_image(img)
            
            # 2. 그레이스케일 변환
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            gray_bgr = cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)
            
            # 3. 엣지 검출
            edges = cv2.Canny(gray, 50, 150)
            edges_bgr = cv2.cvtColor(edges, cv2.COLOR_GRAY2BGR)
            
            # 4. 블러 효과
            blurred = cv2.GaussianBlur(img, (15, 15), 0)
            
            # 5. 색상 변환 (BGR -> HSV)
            hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
            
            # 6. 결과를 2x2 그리드로 배치
            # 상단: 원본, 그레이스케일
            top_row = np.hstack((img, gray_bgr))
            # 하단: 엣지, 블러
            bottom_row = np.hstack((edges_bgr, blurred))
            # 전체 결과
            result = np.vstack((top_row, bottom_row))
            
            # 결과 이미지 표시
            show_image(result)
            
            print("웹캠 이미지 처리가 완료되었습니다!")
            print(f"처리된 이미지 크기: {result.shape}")
            
        except Exception as e:
            print(f"이미지 처리 중 오류 발생: {e}")
            # 오류 발생 시 기본 이미지 생성
            img = np.zeros((480, 640, 3), dtype=np.uint8)
            cv2.putText(img, 'Image Processing Error', (50, 240), 
                       cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
            show_image(img)
    else:
        print("웹캠이 활성화되지 않았습니다. 웹캠을 시작해주세요.")
        # 웹캠이 없을 때 안내 이미지
        img = np.zeros((480, 640, 3), dtype=np.uint8)
        cv2.putText(img, 'Please Start Webcam', (150, 200), 
                   cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
        cv2.putText(img, 'Click "Start Webcam" Button', (100, 280), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
        show_image(img)

# 웹캠 처리 실행
process_webcam_image()`,

  realTimeFaceDetection: `import cv2
import numpy as np
import base64
from io import BytesIO
from PIL import Image
import time

# 실시간 얼굴 인식 예제 (while문 사용)
def real_time_face_detection():
    """웹캠에서 while문을 사용한 실시간 얼굴 인식"""
    
    print("실시간 얼굴 인식 시작...")
    print("'실행 중지' 버튼을 눌러 중지할 수 있습니다.")
    
    frame_count = 0
    
    # while True 루프로 실시간 얼굴 인식
    while True:
        try:
            frame_count += 1
            print(f"프레임 {frame_count} 처리 중...")
            
            # 업로드된 이미지가 있는지 확인
            if 'uploaded_image_data' in globals() and uploaded_image_data:
                # Base64 데이터에서 이미지 추출
                if uploaded_image_data.startswith('data:image'):
                    base64_data = uploaded_image_data.split(',')[1]
                else:
                    base64_data = uploaded_image_data
                
                # Base64를 바이트로 디코딩
                image_bytes = base64.b64decode(base64_data)
                
                # PIL Image로 변환
                pil_image = Image.open(BytesIO(image_bytes))
                
                # OpenCV 형식으로 변환 (RGB -> BGR)
                frame = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
                
                # 프레임에 번호 표시
                cv2.putText(frame, f'Frame {frame_count}', (10, 30), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
                
                # 시간 표시
                current_time = time.strftime("%H:%M:%S")
                cv2.putText(frame, current_time, (10, 60), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
                
                # 얼굴 인식 처리
                # 1. 그레이스케일 변환
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                
                # 2. 가우시안 블러로 노이즈 제거
                blurred = cv2.GaussianBlur(gray, (5, 5), 0)
                
                # 3. 얼굴 영역 검출 시뮬레이션
                _, thresh = cv2.threshold(blurred, 100, 255, cv2.THRESH_BINARY)
                
                # 4. 컨투어 찾기
                contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
                
                # 5. 얼굴 영역 그리기
                result_frame = frame.copy()
                face_count = 0
                
                for contour in contours:
                    # 면적이 충분한 컨투어만 얼굴로 간주
                    area = cv2.contourArea(contour)
                    if area > 5000:  # 임계값 조정 가능
                        x, y, w, h = cv2.boundingRect(contour)
                        
                        # 얼굴 비율 체크
                        aspect_ratio = w / h
                        if 0.7 < aspect_ratio < 1.4:  # 얼굴 비율 범위
                            # 얼굴 영역 그리기
                            cv2.rectangle(result_frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
                            cv2.putText(result_frame, f'Face {face_count + 1}', (x, y - 10), 
                                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
                            face_count += 1
                
                # 6. 결과 표시
                if face_count > 0:
                    print(f"프레임 {frame_count}: 감지된 얼굴 수: {face_count}")
                    show_image(result_frame)
                else:
                    print(f"프레임 {frame_count}: 얼굴이 감지되지 않음")
                    show_image(frame)
                
                # 0.5초 대기 (실제 웹캠에서는 필요 없음)
                time.sleep(0.5)
                
            else:
                print("웹캠이 활성화되지 않았습니다.")
                print("1. '웹캠 시작' 버튼을 클릭하세요")
                print("2. 카메라 권한을 허용하세요")
                
                # 안내 이미지
                img = np.zeros((480, 640, 3), dtype=np.uint8)
                cv2.putText(img, 'Start Webcam First!', (150, 200), 
                           cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
                cv2.putText(img, '1. Click "Start Webcam"', (100, 250), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
                cv2.putText(img, '2. Allow Camera Permission', (80, 300), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
                show_image(img)
                break
                
        except KeyboardInterrupt:
            print("사용자에 의해 중지되었습니다.")
            break
        except Exception as e:
            print(f"얼굴 인식 중 오류 발생: {e}")
            break
    
    print("실시간 얼굴 인식이 종료되었습니다.")

# 실시간 얼굴 인식 실행
real_time_face_detection()`,

  whileLoopExample: `import cv2
import numpy as np
import time

# while True 루프 예제 - 실시간 처리
def real_time_processing():
    """while True 루프를 사용한 실시간 처리 예제"""
    
    print("실시간 처리를 시작합니다...")
    print("'실행 중지' 버튼을 눌러 중지할 수 있습니다.")
    
    frame_count = 0
    
    # while True 루프로 실시간 처리
    while True:
        try:
            frame_count += 1
            print(f"프레임 {frame_count} 처리 중...")
            
            # 가상의 프레임 생성 (실제로는 웹캠에서 받아옴)
            frame = np.random.randint(0, 255, (480, 640, 3), dtype=np.uint8)
            
            # 프레임에 번호 표시
            cv2.putText(frame, f'Frame {frame_count}', (50, 50), 
                       cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
            
            # 시간 표시
            current_time = time.strftime("%H:%M:%S")
            cv2.putText(frame, current_time, (50, 100), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
            
            # 간단한 이미지 처리
            if frame_count % 2 == 0:
                # 짝수 프레임: 그레이스케일
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                frame = cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)
                cv2.putText(frame, 'Grayscale', (50, 150), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
            else:
                # 홀수 프레임: 엣지 검출
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                edges = cv2.Canny(gray, 50, 150)
                frame = cv2.cvtColor(edges, cv2.COLOR_GRAY2BGR)
                cv2.putText(frame, 'Edge Detection', (50, 150), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
            
            # 결과 표시
            show_image(frame)
            
            # 0.5초 대기 (실제로는 필요 없지만 시뮬레이션용)
            time.sleep(0.5)
            
            # 중지 조건 체크 (실제로는 외부에서 제어)
            if frame_count >= 10:  # 10프레임 후 자동 중지
                print("처리 완료!")
                break
                
        except KeyboardInterrupt:
            print("사용자에 의해 중지되었습니다.")
            break
        except Exception as e:
            print(f"처리 중 오류 발생: {e}")
            break
    
    print("실시간 처리가 종료되었습니다.")

# 실시간 처리 실행
real_time_processing()`,
};
