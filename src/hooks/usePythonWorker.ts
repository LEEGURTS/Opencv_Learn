import { useState, useEffect, useRef } from "react";

interface PythonWorkerHook {
  isLoaded: boolean;
  error: string | null;
  runPythonCode: (code: string, imageData?: string) => Promise<string>;
  stopPythonCode: () => void;
  reinitialize: () => void;
}

export const usePythonWorker = (): PythonWorkerHook => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const pendingResolves = useRef<Map<string, (value: string) => void>>(
    new Map()
  );

  useEffect(() => {
    // Web Worker 생성 (public 폴더에서 로드)
    const worker = new Worker("/pythonWorker.js");
    workerRef.current = worker;

    worker.onmessage = (event) => {
      const {
        type,
        output,
        error: workerError,
        imgDataUrl,
        canvasId,
      } = event.data;

      switch (type) {
        case "ready":
          setIsLoaded(true);
          setError(null);
          break;

        case "result":
          // 결과를 기다리는 resolve 함수 호출
          const resolve = pendingResolves.current.get("result");
          if (resolve) {
            resolve(output);
            pendingResolves.current.delete("result");
          }
          break;

        case "error":
          setError(workerError);
          const errorResolve = pendingResolves.current.get("result");
          if (errorResolve) {
            errorResolve(`오류: ${workerError}`);
            pendingResolves.current.delete("result");
          }
          break;

        case "showImage":
          // 이미지를 캔버스에 표시
          showImageOnCanvas(imgDataUrl, canvasId);
          break;
      }
    };

    worker.onerror = (error) => {
      setError(`Worker 오류: ${error.message}`);
    };

    // Pyodide 초기화
    worker.postMessage({ type: "init" });

    return () => {
      worker.terminate();
    };
  }, []);

  const showImageOnCanvas = (imgDataUrl: string, canvasId: string) => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // 캔버스 크기를 이미지에 맞게 조정
      canvas.width = img.width;
      canvas.height = img.height;

      // 이미지를 캔버스에 그리기
      ctx.drawImage(img, 0, 0);
    };
    img.src = imgDataUrl;
  };

  const runPythonCode = async (
    code: string,
    imageData?: string
  ): Promise<string> => {
    if (!workerRef.current || !isLoaded) {
      throw new Error("Python worker not ready");
    }

    return new Promise((resolve) => {
      // resolve 함수를 저장
      pendingResolves.current.set("result", resolve);

      // Python 코드 실행 요청
      workerRef.current!.postMessage({
        type: "runCode",
        code,
        imageData,
      });
    });
  };

  const stopPythonCode = () => {
    if (workerRef.current && isLoaded) {
      workerRef.current.postMessage({
        type: "stopCode",
      });
    }
  };

  const reinitialize = () => {
    // Worker 종료
    if (workerRef.current) {
      workerRef.current.terminate();
    }

    // 상태 초기화
    setIsLoaded(false);
    setError(null);

    // 페이지 새로고침으로 완전 재초기화
    window.location.reload();
  };

  return {
    isLoaded,
    error,
    runPythonCode,
    stopPythonCode,
    reinitialize,
  };
};
