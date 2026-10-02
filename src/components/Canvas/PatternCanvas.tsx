//This is where the actual pattern drawing happens.
 
import { useEffect, useRef } from 'react';
import { usePatternStore } from '../../store/patternStore';
import type { PatternConfig } from '../../types/pattern';

export function PatternCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const config = usePatternStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Clear canvas
    ctx.fillStyle = config.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw pattern
    drawPattern(ctx, canvas.width, config);
  }, [config]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full border border-gray-700 bg-black"
    />
  );
}

function drawPattern(
  ctx: CanvasRenderingContext2D,
  width: number,
  config: PatternConfig
) {
  const cellSize = (width / config.gridMultiply) * (config.scale / 2);
  const cols = config.gridMultiply;
  const rows = config.gridMultiply;

  ctx.strokeStyle = config.shapeColor;
  ctx.lineWidth = 2;
  ctx.filter = `blur(${config.blur}px)`;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * cellSize + (row % 2) * config.gridOffset.x;
      const y = row * cellSize + (row % 2) * config.gridOffset.y;

      ctx.save();
      ctx.translate(x + cellSize / 2, y + cellSize / 2);
      ctx.rotate((config.rotation * Math.PI) / 180);
      ctx.scale(config.stretch.x, config.stretch.y);
      ctx.translate(-cellSize / 2, -cellSize / 2);

      drawShape(ctx, config.baseShape, cellSize);

      ctx.restore();
    }
  }
}

function drawShape(
  ctx: CanvasRenderingContext2D,
  shape: string,
  size: number
) {
  const padding = 5;
  const x = padding;
  const y = padding;
  const w = size - padding * 2;
  const h = size - padding * 2;

  ctx.beginPath();

  switch (shape) {
    case 'line':
      ctx.moveTo(x, y + h / 2);
      ctx.lineTo(x + w, y + h / 2);
      break;

    case 'plus':
      ctx.moveTo(x + w / 2, y);
      ctx.lineTo(x + w / 2, y + h);
      ctx.moveTo(x, y + h / 2);
      ctx.lineTo(x + w, y + h / 2);
      break;

    case 'asterisk':
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI;
        const x1 = x + w / 2 + Math.cos(angle) * (w / 2);
        const y1 = y + h / 2 + Math.sin(angle) * (h / 2);
        if (i === 0) ctx.moveTo(x1, y1);
        else ctx.lineTo(x1, y1);
      }
      break;

    case '0':
      ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
      break;

    case '1':
      ctx.font = `bold ${h}px monospace`;
      ctx.fillStyle = ctx.strokeStyle;
      ctx.fillText('1', x, y + h);
      break;
  }

  ctx.stroke();
}