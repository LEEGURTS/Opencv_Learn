import { useState, useEffect } from "react";

interface PythonState {
  pyodide: any;
  isLoaded: boolean;
  error: string | null;
  reinitialize: () => void;
}

export const usePython = (): PythonState => {
  const [pyodide, setPyodide] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPyodide = async () => {
      try {
        // Pyodide 스크립트를 동적으로 로드
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js";
        script.async = true;

        script.onload = async () => {
          try {
            // Pyodide 초기화
            const pyodideInstance = await (window as any).loadPyodide({
              indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
            });

            // OpenCV 패키지 설치
            await pyodideInstance.loadPackage("opencv-python");
            await pyodideInstance.loadPackage("numpy");
            await pyodideInstance.loadPackage("matplotlib");

            // 이미지 출력을 위한 JavaScript 함수 등록
            pyodideInstance.registerJsModule("image_utils", {
              showImage: (imageDataUrl: string, canvasId: string) => {
                const canvas = document.getElementById(
                  canvasId
                ) as HTMLCanvasElement;
                if (!canvas) return;

                const ctx = canvas.getContext("2d");
                if (!ctx) return;

                try {
                  const img = new Image();
                  img.onload = () => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    console.log(
                      `이미지가 ${canvasId} 캔버스에 표시되었습니다.`
                    );
                  };
                  img.onerror = () => {
                    console.error("이미지 로드 실패");
                    ctx.fillStyle = "#f0f0f0";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                  };
                  img.src = imageDataUrl;
                } catch (error) {
                  console.error("이미지 표시 오류:", error);
                  ctx.fillStyle = "#f0f0f0";
                  ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
              },
            });

            // Python에서 사용할 편의 함수들을 등록
            pyodideInstance.runPython(`
import cv2
import base64
import image_utils

def show_image(img, canvas_id="result-canvas"):
    """OpenCV Mat 또는 numpy 배열을 캔버스에 표시하는 편의 함수"""
    import numpy as np
    
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

            setPyodide(pyodideInstance);
            setIsLoaded(true);
          } catch (err) {
            setError("Python 패키지 로드에 실패했습니다.");
            console.error("Pyodide 초기화 오류:", err);
          }
        };

        script.onerror = () => {
          setError("Pyodide 로드에 실패했습니다.");
        };

        document.head.appendChild(script);
      } catch (err) {
        setError("Python 초기화 중 오류가 발생했습니다.");
        console.error("Python 로드 오류:", err);
      }
    };

    loadPyodide();
  }, []);

  const reinitialize = () => {
    setPyodide(null);
    setIsLoaded(false);
    setError(null);

    // 페이지 새로고침으로 완전 재초기화
    window.location.reload();
  };

  return { pyodide, isLoaded, error, reinitialize };
};
