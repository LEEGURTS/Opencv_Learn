// Python 실행을 위한 Web Worker
let pyodideInstance = null;
let shouldStopExecution = false;
let currentExecution = null;

// Pyodide 로드 함수
async function loadPyodide() {
  // Pyodide를 직접 로드
  await import("https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js");

  // 전역 loadPyodide 함수 사용
  pyodideInstance = await self.loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
  });

  // how to use this package?

  // 필요한 패키지 설치
  await pyodideInstance.loadPackage([
    "opencv-python",
    "numpy",
    "matplotlib",
    "pillow",
  ]);

  // JavaScript 함수를 Python 모듈로 등록
  pyodideInstance.registerJsModule("image_utils", {
    showImage: (imgDataUrl, canvasId) => {
      self.postMessage({
        type: "showImage",
        imgDataUrl,
        canvasId,
      });
    },
  });

  // Python 편의 함수 등록
  pyodideInstance.runPython(`
import cv2
import base64
import image_utils
import numpy as np
import sys
from io import StringIO

# stdout을 캡처하도록 설정
sys.stdout = StringIO()

def show_image(img, canvas_id="result-canvas"):
    """OpenCV Mat 또는 numpy 배열을 캔버스에 표시하는 편의 함수"""
    
    # OpenCV Mat 객체인지 확인
    is_cv_mat = hasattr(img, 'shape') and hasattr(img, 'dtype') and not isinstance(img, np.ndarray)
    
    # numpy 배열인 경우 처리
    if isinstance(img, np.ndarray):
        # numpy 배열의 데이터 타입과 채널 수 확인
        if img.dtype != np.uint8:
            # 0-1 범위의 float 배열인 경우 0-255 범위로 변환
            if img.dtype in [np.float32, np.float64]:
                img = (img * 255).astype(np.uint8)
            else:
                img = img.astype(np.uint8)
        
        # 그레이스케일 이미지인 경우 컬러로 변환
        if len(img.shape) == 2:
            img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
        elif len(img.shape) == 3 and img.shape[2] == 1:
            img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
    
    # OpenCV Mat 객체인 경우 그대로 사용 (이미 올바른 형식)
    elif is_cv_mat:
        # OpenCV Mat은 이미 올바른 형식이므로 그대로 사용
        pass
    
    # 기타 경우 numpy 배열로 변환 시도
    else:
        try:
            img = np.array(img)
            if img.dtype != np.uint8:
                if img.dtype in [np.float32, np.float64]:
                    img = (img * 255).astype(np.uint8)
                else:
                    img = img.astype(np.uint8)
        except:
            print(f"지원하지 않는 이미지 형식: {type(img)}")
            return
    
    # OpenCV Mat 또는 변환된 배열을 PNG로 인코딩
    _, buffer = cv2.imencode('.png', img)
    img_base64 = base64.b64encode(buffer).decode('utf-8')
    img_data_url = f"data:image/png;base64,{img_base64}"
    image_utils.showImage(img_data_url, canvas_id)

def display_image(img, canvas_id="result-canvas"):
    """show_image의 별칭"""
    show_image(img, canvas_id)

# 전역 함수로 등록
import sys
sys.modules['__main__'].show_image = show_image
sys.modules['__main__'].display_image = display_image
  `);

  return pyodideInstance;
}

// 메시지 처리
self.onmessage = async (event) => {
  const { type, code, imageData } = event.data;

  try {
    if (type === "init") {
      // Pyodide 초기화
      await loadPyodide();
      self.postMessage({ type: "ready" });
    } else if (type === "runCode") {
      if (!pyodideInstance) {
        throw new Error("Pyodide not initialized");
      }

      // 실행 중지 플래그 초기화
      shouldStopExecution = false;

      // 이미지 데이터 설정
      if (imageData) {
        pyodideInstance.globals.set("uploaded_image_data", imageData);
      }

      // stdout 초기화
      pyodideInstance.runPython("sys.stdout = StringIO()");

      // 실행 중지 플래그 초기화
      shouldStopExecution = false;

      // Python 코드 실행을 Promise로 래핑
      const executionPromise = pyodideInstance.runPython(code);
      currentExecution = executionPromise;

      // 실행 완료 또는 중지 대기
      const result = await Promise.race([
        executionPromise,
        new Promise((resolve) => {
          const checkStop = () => {
            if (shouldStopExecution) {
              resolve("STOPPED");
            } else {
              setTimeout(checkStop, 100); // 100ms마다 체크
            }
          };
          checkStop();
        }),
      ]);

      // 실행이 중지되었는지 확인
      if (result === "STOPPED" || shouldStopExecution) {
        self.postMessage({
          type: "result",
          output: "실행이 중지되었습니다.",
        });
        return;
      }

      // Python의 print 출력을 캡처
      const stdout = pyodideInstance.runPython(
        "import sys; sys.stdout.getvalue()"
      );

      let output = "";
      if (stdout && stdout.trim()) {
        output = stdout;
      } else if (result) {
        output = String(result);
      } else {
        output = "코드가 성공적으로 실행되었습니다.";
      }

      self.postMessage({
        type: "result",
        output: output,
      });
    } else if (type === "stopCode") {
      // 실행 중지 신호
      shouldStopExecution = true;

      // 현재 실행 중인 코드가 있으면 강제 중지
      if (currentExecution) {
        try {
          // Pyodide 실행을 중단하려고 시도
          pyodideInstance.runPython(`
import sys
sys.exit(0)
          `);
        } catch (e) {
          // 중지 중 오류는 무시
        }
        currentExecution = null;
      }

      self.postMessage({
        type: "result",
        output: "실행 중지 신호를 받았습니다.",
      });
    }
  } catch (error) {
    if (shouldStopExecution) {
      self.postMessage({
        type: "result",
        output: "실행이 중지되었습니다.",
      });
    } else {
      self.postMessage({
        type: "error",
        error: String(error),
      });
    }
  } finally {
    // 실행 완료 시 currentExecution 초기화
    if (type === "runCode") {
      currentExecution = null;
    }
  }
};
