"use client";

import React, { useState, useRef } from "react";
import { usePython } from "@/hooks/usePython";

interface PythonCodeEditorProps {
  initialCode?: string;
  onOutput?: (output: string) => void;
}

export const PythonCodeEditor: React.FC<PythonCodeEditorProps> = ({
  initialCode = `import cv2
import numpy as np
import matplotlib.pyplot as plt

# 이미지 로드 (예시)
# img = cv2.imread('image.jpg')
# gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
# cv2.imshow('Original', img)
# cv2.imshow('Gray', gray)
# cv2.waitKey(0)
# cv2.destroyAllWindows()

print("OpenCV Python 환경이 준비되었습니다!")`,
  onOutput,
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const { pyodide, isLoaded, error } = usePython();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const runCode = async () => {
    if (!pyodide || !isLoaded) return;

    setIsRunning(true);
    setOutput("");

    try {
      // Python 코드 실행
      const result = await pyodide.runPython(code);

      // 출력 결과 처리
      const outputText = result
        ? String(result)
        : "코드가 성공적으로 실행되었습니다.";
      setOutput(outputText);

      if (onOutput) {
        onOutput(outputText);
      }
    } catch (err) {
      const errorMessage = `오류: ${err}`;
      setOutput(errorMessage);
      console.error("Python 실행 오류:", err);
    } finally {
      setIsRunning(false);
    }
  };

  const clearOutput = () => {
    setOutput("");
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-red-100 border border-red-300 rounded-lg">
        <p className="text-red-600">오류: {error}</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 border border-gray-300 rounded-lg">
        <p className="text-gray-600">Python 환경 로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <button
          onClick={runCode}
          disabled={isRunning}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          {isRunning ? "실행 중..." : "코드 실행"}
        </button>
        <button
          onClick={clearOutput}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          출력 지우기
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 코드 에디터 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Python 코드
          </label>
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Python 코드를 입력하세요..."
          />
        </div>

        {/* 출력 영역 */}
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
  );
};
