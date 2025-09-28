"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { usePythonWorker } from "@/hooks/usePythonWorker";
import { PYTHON_TEMPLATES } from "@/constants/pythonTemplates";
import { DEFAULT_PYTHON_CODE } from "@/constants/defaultCode";

interface OpenCVLearningCanvasProps {
  width?: number;
  height?: number;
}

export const OpenCVLearningCanvas: React.FC<OpenCVLearningCanvasProps> = ({
  width = 640,
  height = 480,
}) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [pythonCode, setPythonCode] = useState(DEFAULT_PYTHON_CODE);
  const [selectedTemplate, setSelectedTemplate] = useState("basic");
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);

  // Python이 로드되면 자동으로 기본 예제 실행 (한 번만)
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [hasRunInitial, setHasRunInitial] = useState(false);
  const {
    isLoaded,
    runPythonCode: runPythonCodeWorker,
    stopPythonCode: stopPythonCodeWorker,
  } = usePythonWorker();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setUploadedImage(imageData);
    };
    reader.readAsDataURL(file);
  };

  const handleTemplateChange = (template: string) => {
    console.log("Changing template to:", template);
    setSelectedTemplate(template);

    // 템플릿에 따른 코드 설정
    let newCode = "";
    switch (template) {
      case "basic":
        newCode = PYTHON_TEMPLATES.basic;
        break;
      case "faceDetection":
        newCode = PYTHON_TEMPLATES.faceDetection;
        break;
      case "imageFilters":
        newCode = PYTHON_TEMPLATES.imageFilters;
        break;
      case "edgeDetection":
        newCode = PYTHON_TEMPLATES.edgeDetection;
        break;
      case "colorSpace":
        newCode = PYTHON_TEMPLATES.colorSpace;
        break;
      case "numpyArray":
        newCode = PYTHON_TEMPLATES.numpyArray;
        break;
      case "opencvMat":
        newCode = PYTHON_TEMPLATES.opencvMat;
        break;
      case "videoProcessing":
        newCode = PYTHON_TEMPLATES.videoProcessing;
        break;
      case "realVideoProcessing":
        newCode = PYTHON_TEMPLATES.realVideoProcessing;
        break;
      case "realTimeFaceDetection":
        newCode = PYTHON_TEMPLATES.realTimeFaceDetection;
        break;
      case "whileLoopExample":
        newCode = PYTHON_TEMPLATES.whileLoopExample;
        break;
      default:
        newCode = PYTHON_TEMPLATES.basic;
    }

    setPythonCode(newCode);
    console.log("New code set:", newCode.substring(0, 100) + "...");
  };

  const clearOutput = () => {
    setOutput("");
  };

  const stopPythonCode = () => {
    setIsRunning(false);
    setOutput("Python 코드 실행이 중지되었습니다.");
    stopPythonCodeWorker();
  };

  // 웹캠 시작
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });
      setWebcamStream(stream);
      setIsWebcamActive(true);
      console.log("웹캠이 시작되었습니다.");
    } catch (error) {
      console.error("웹캠 접근 실패:", error);
      setOutput("웹캠 접근에 실패했습니다. 카메라 권한을 확인해주세요.");
    }
  };

  // 웹캠 중지
  const stopWebcam = () => {
    if (webcamStream) {
      webcamStream.getTracks().forEach((track) => track.stop());
      setWebcamStream(null);
      setIsWebcamActive(false);
      console.log("웹캠이 중지되었습니다.");
    }
  };

  // 웹캠 프레임을 캡처하여 Python으로 전달
  const captureWebcamFrame = useCallback(async (): Promise<string | null> => {
    if (!webcamStream) return null;

    const video = document.createElement("video");
    video.srcObject = webcamStream;
    video.play();

    return new Promise((resolve) => {
      video.onloadedmetadata = () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          ctx.drawImage(video, 0, 0);
          const dataURL = canvas.toDataURL("image/jpeg");
          resolve(dataURL);
        } else {
          resolve(null);
        }
      };
    });
  }, [webcamStream]);

  const runPythonCode = useCallback(async () => {
    if (!isLoaded) {
      setOutput(
        "Python 환경이 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요."
      );
      return;
    }
    setIsRunning(true);
    setOutput("");

    try {
      // 캔버스 초기화
      const canvas = document.getElementById(
        "result-canvas"
      ) as HTMLCanvasElement;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = "#f0f0f0";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }

      console.log("Running Python code:", pythonCode.substring(0, 100) + "...");

      // 웹캠이 활성화된 경우 프레임 캡처
      let imageData = uploadedImage || undefined;
      if (isWebcamActive && !uploadedImage) {
        const webcamFrame = await captureWebcamFrame();
        if (webcamFrame) {
          imageData = webcamFrame;
        }
      }

      // Web Worker를 통해 Python 코드 실행
      const result = await runPythonCodeWorker(pythonCode, imageData);

      setOutput(result);
      console.log("Python execution completed:", result);
    } catch (err) {
      const errorMessage = `오류: ${err}`;
      setOutput(errorMessage);
      console.error("Python 실행 오류:", err);
    } finally {
      setIsRunning(false);
    }
  }, [
    isLoaded,
    pythonCode,
    uploadedImage,
    isWebcamActive,
    runPythonCodeWorker,
    captureWebcamFrame,
  ]);

  React.useEffect(() => {
    if (isLoaded && !hasRunInitial) {
      console.log("Python worker loaded, running initial example...");
      setHasRunInitial(true);
      // 약간의 지연을 두고 실행
      setTimeout(() => {
        console.log("Auto-running initial code...");
        runPythonCode();
      }, 2000);
    }
  }, [isLoaded, hasRunInitial, runPythonCode]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 border border-gray-300 rounded-lg">
        <p className="text-gray-600">Python 환경 로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 이미지 업로드 섹션 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">이미지 업로드</h3>
        <div className="flex gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            이미지 선택
          </button>
          {uploadedImage && (
            <div className="text-sm text-green-600">
              ✓ 이미지가 업로드되었습니다
            </div>
          )}
        </div>

        {uploadedImage && (
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <Image
              src={uploadedImage}
              alt="Uploaded"
              width={300}
              height={300}
              className="max-w-full h-auto"
              style={{ objectFit: "contain", maxHeight: "300px" }}
            />
          </div>
        )}
      </div>

      {/* 템플릿 선택 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">코드 템플릿</h3>
        <div className="flex flex-wrap gap-2">
          {Object.keys(PYTHON_TEMPLATES).map((template) => (
            <button
              key={template}
              onClick={() => {
                console.log("Button clicked:", template);
                handleTemplateChange(template);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTemplate === template
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {template === "basic" && "기본"}
              {template === "faceDetection" && "얼굴 인식"}
              {template === "imageFilters" && "이미지 필터"}
              {template === "edgeDetection" && "엣지 검출"}
              {template === "colorSpace" && "색상 공간"}
              {template === "numpyArray" && "NumPy 배열"}
              {template === "opencvMat" && "OpenCV Mat"}
              {template === "videoProcessing" && "비디오 처리"}
              {template === "realVideoProcessing" && "실제 비디오"}
              {template === "realTimeFaceDetection" && "실시간 얼굴인식"}
              {template === "whileLoopExample" && "While 루프"}
            </button>
          ))}
        </div>
      </div>

      {/* Python 코드 에디터 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Python 코드</h3>
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={runPythonCode}
            disabled={isRunning}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            {isRunning ? "실행 중..." : "코드 실행"}
          </button>
          {isRunning && (
            <button
              onClick={stopPythonCode}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              실행 중지
            </button>
          )}
          <button
            onClick={clearOutput}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            출력 지우기
          </button>
          <button
            onClick={isWebcamActive ? stopWebcam : startWebcam}
            className={`px-4 py-2 rounded transition-colors ${
              isWebcamActive
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {isWebcamActive ? "웹캠 중지" : "웹캠 시작"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Python 코드
            </label>
            <textarea
              value={pythonCode}
              onChange={(e) => setPythonCode(e.target.value)}
              className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Python 코드를 입력하세요..."
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              실행 결과
            </label>
            <div className="w-full h-96 p-4 bg-gray-50 border border-gray-300 rounded-lg overflow-auto">
              <pre className="whitespace-pre-wrap text-sm">
                {output || "코드를 실행하면 결과가 여기에 표시됩니다."}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* 결과 캔버스 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          처리 결과
        </label>
        <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-100">
          <canvas
            ref={canvasRef}
            id="result-canvas"
            width={width}
            height={height}
            className="max-w-full h-auto"
            style={{
              display: "block",
              backgroundColor: "#f0f0f0",
              border: "1px solid #ccc",
            }}
          />
        </div>
        <div className="text-sm text-gray-500 space-y-1">
          <p>
            Python 코드에서{" "}
            <code className="bg-gray-200 px-1 rounded">show_image(img)</code>를
            사용하여 이미지를 표시할 수 있습니다.
          </p>
          <p className="text-blue-600">
            💡 팁:{" "}
            <code className="bg-blue-100 px-1 rounded">show_image()</code>{" "}
            함수는 OpenCV Mat과 numpy 배열 모두 지원합니다!
          </p>
          <p className="text-green-600">
            ✨ 지원 형식: OpenCV Mat, numpy 배열 (2D/3D), float 배열 (0-1 범위)
          </p>
          <p className="text-purple-600">
            🎬 비디오 처리: 프레임별로{" "}
            <code className="bg-purple-100 px-1 rounded">show_image()</code>를
            호출하여 동영상을 처리할 수 있습니다!
          </p>
        </div>
      </div>
    </div>
  );
};
