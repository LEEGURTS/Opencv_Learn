// OpenCV Mat을 HTML Canvas에 그리는 유틸리티 함수들

export const drawMatToCanvas = (mat: any, canvas: HTMLCanvasElement) => {
  if (!mat || !canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Mat을 ImageData로 변환
  const imageData = new ImageData(
    new Uint8ClampedArray(mat.data),
    mat.cols,
    mat.rows
  );

  // Canvas 크기 설정
  canvas.width = mat.cols;
  canvas.height = mat.rows;

  // ImageData를 Canvas에 그리기
  ctx.putImageData(imageData, 0, 0);
};

export const matToImageData = (mat: any): ImageData => {
  if (!mat) return new ImageData(1, 1);

  return new ImageData(new Uint8ClampedArray(mat.data), mat.cols, mat.rows);
};

export const createImageFromMat = (mat: any): string => {
  if (!mat) return "";

  const canvas = document.createElement("canvas");
  canvas.width = mat.cols;
  canvas.height = mat.rows;

  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const imageData = new ImageData(
    new Uint8ClampedArray(mat.data),
    mat.cols,
    mat.rows
  );

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL();
};
