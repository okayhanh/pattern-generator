// The on-screen preview of the pattern. The drawing itself lives in utils/renderPattern.ts.

import { useEffect, useRef, useState } from 'react';
import { usePatternStore } from '../../store/patternStore';
import { renderPattern } from '../../utils/renderPattern';

// Gray checkerboard shown behind the canvas so transparent areas are visible.
// It's CSS on the page only, so it never ends up in the downloaded PNG.
// It goes on the wrapper div, because Chrome doesn't paint gradients on the canvas element itself.
const CHECKERBOARD = 'repeating-conic-gradient(#808080 0% 25%, #b0b0b0 0% 50%) 50% / 20px 20px';

export function PatternCanvas() {
  const config = usePatternStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  // Watch the container and record its size whenever the window is resized
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || size.width === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Match the canvas to its on-screen size, with extra pixels for sharp screens
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(size.width * dpr);
    canvas.height = Math.round(size.height * dpr);
    ctx.scale(dpr, dpr);

    renderPattern(ctx, size.width, size.height, config);
  }, [config, size]);

  return (
    <div
      ref={containerRef}
      className="relative flex-1 min-h-0"
      style={{ background: config.transparentBackground ? CHECKERBOARD : 'black' }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}
