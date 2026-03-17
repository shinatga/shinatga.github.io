import { CanvasTexture } from "three";

interface TextTextureOptions {
  text: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  color?: string;
  resolution?: number;
}

export function createTextTexture(opts: TextTextureOptions): CanvasTexture {
  const {
    text,
    fontSize = 48,
    fontFamily = "Arial",
    fontWeight = "bold",
    color = "#ffffff",
    resolution = 4,
  } = opts;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  const scaledFontSize = fontSize * resolution;
  ctx.font = `${fontWeight} ${scaledFontSize}px ${fontFamily}`;
  const metrics = ctx.measureText(text);
  const textWidth = metrics.width;
  const textHeight = scaledFontSize * 1.4;

  const padding = scaledFontSize * 0.3;
  canvas.width = Math.ceil(textWidth + padding * 2);
  canvas.height = Math.ceil(textHeight + padding * 2);

  // Re-set font after resize
  ctx.font = `${fontWeight} ${scaledFontSize}px ${fontFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = color;
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function createImageTexture(src: string): Promise<CanvasTexture> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const texture = new CanvasTexture(canvas);
      texture.needsUpdate = true;
      resolve(texture);
    };
    img.onerror = reject;
    img.src = src;
  });
}
