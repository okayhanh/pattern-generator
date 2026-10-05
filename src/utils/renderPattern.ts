// Works out the pattern's geometry once, then draws it either onto a canvas
// (preview and PNG export) or as SVG text (SVG export), so all of them always match.

import type { PatternConfig } from '../types/pattern';

// Grid Multiply = how many cells fit across this many pixels (5 → 200px cells)
const REFERENCE_WIDTH = 1000;

// The building blocks every shape is made of
type ShapePart =
  | { kind: 'line'; x1: number; y1: number; x2: number; y2: number }
  | { kind: 'ellipse'; cx: number; cy: number; rx: number; ry: number; rotation: number };

// Every copy of the shape in the pattern, each as a list of parts in final page positions.
// Rotation and Scale are already applied to the positions, so the outline drawn around them
// (thickness and dashes) stays the same number of pixels whatever the Scale.
function getPatternShapes(width: number, height: number, config: PatternConfig): ShapePart[][] {
  // Cell size is fixed in pixels, so the same slider values look the same on every screen.
  // A bigger canvas shows more repeats instead of bigger shapes.
  const cellSize = REFERENCE_WIDTH / config.gridMultiply;
  const cols = Math.ceil(width / cellSize);
  const rows = Math.ceil(height / cellSize);

  // Grid offset is a percentage of a cell
  const offsetX = (config.gridOffset.x / 100) * cellSize;
  const offsetY = (config.gridOffset.y / 100) * cellSize;

  const half = cellSize / 2;
  const angle = (config.rotation * Math.PI) / 180;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const scaleX = config.scale * config.stretch.x;
  const scaleY = config.scale * config.stretch.y;

  // The shape, drawn once inside a single cell
  const parts = getShapeParts(config.baseShape, cellSize);

  const shapes: ShapePart[][] = [];
  // Start one cell before the edge and end one after, so offsets and rotation never leave gaps
  for (let row = -1; row <= rows; row++) {
    for (let col = -1; col <= cols; col++) {
      const isOddRow = Math.abs(row % 2);
      const centerX = col * cellSize + isOddRow * offsetX + half;
      const centerY = row * cellSize + isOddRow * offsetY + half;

      // Move a point from the cell drawing to its final spot: scale it, rotate it
      // around the cell's center, then move it to this copy's center
      const place = (x: number, y: number) => {
        const sx = (x - half) * scaleX;
        const sy = (y - half) * scaleY;
        return { x: centerX + sx * cos - sy * sin, y: centerY + sx * sin + sy * cos };
      };

      shapes.push(
        parts.map((part): ShapePart => {
          if (part.kind === 'line') {
            const start = place(part.x1, part.y1);
            const end = place(part.x2, part.y2);
            return { kind: 'line', x1: start.x, y1: start.y, x2: end.x, y2: end.y };
          }
          const center = place(part.cx, part.cy);
          return {
            kind: 'ellipse',
            cx: center.x,
            cy: center.y,
            rx: part.rx * Math.abs(scaleX),
            ry: part.ry * Math.abs(scaleY),
            rotation: config.rotation,
          };
        })
      );
    }
  }

  return shapes;
}

function getShapeParts(shape: PatternConfig['baseShape'], size: number): ShapePart[] {
  const padding = 5;
  const x = padding;
  const y = padding;
  const w = size - padding * 2;
  const h = size - padding * 2;
  const centerX = x + w / 2;
  const centerY = y + h / 2;

  switch (shape) {
    case 'line':
      return [{ kind: 'line', x1: x, y1: centerY, x2: x + w, y2: centerY }];

    case 'plus':
      return [
        { kind: 'line', x1: centerX, y1: y, x2: centerX, y2: y + h },
        { kind: 'line', x1: x, y1: centerY, x2: x + w, y2: centerY },
      ];

    case 'asterisk': {
      // Three separate lines through the center, 60° apart, make a six-armed asterisk
      const lines = 3;
      const parts: ShapePart[] = [];
      for (let i = 0; i < lines; i++) {
        const angle = Math.PI / 2 + (i * Math.PI) / lines;
        const dx = Math.cos(angle) * (w / 2);
        const dy = Math.sin(angle) * (h / 2);
        parts.push({
          kind: 'line',
          x1: centerX - dx,
          y1: centerY - dy,
          x2: centerX + dx,
          y2: centerY + dy,
        });
      }
      return parts;
    }

    case 'circle':
      return [{ kind: 'ellipse', cx: centerX, cy: centerY, rx: w / 2, ry: h / 2, rotation: 0 }];
  }
}

// ---------- Canvas (preview and PNG) ----------

export function renderPattern(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  config: PatternConfig
) {
  // Fill the background, unless it should stay transparent
  // (a freshly sized canvas starts out as fully transparent pixels)
  if (!config.transparentBackground) {
    ctx.fillStyle = config.backgroundColor;
    ctx.fillRect(0, 0, width, height);
  }

  ctx.strokeStyle = config.shapeColor;
  ctx.lineWidth = config.lineWidth;
  ctx.setLineDash(config.dashed ? [config.dashLength, config.dashGap] : []);
  ctx.filter = `blur(${config.blur}px)`;

  ctx.beginPath();
  for (const shape of getPatternShapes(width, height, config)) {
    for (const part of shape) {
      if (part.kind === 'line') {
        ctx.moveTo(part.x1, part.y1);
        ctx.lineTo(part.x2, part.y2);
      } else {
        const rotation = (part.rotation * Math.PI) / 180;
        // Lift the pen to where the ellipse starts, so no stray line joins it to the last part
        ctx.moveTo(part.cx + part.rx * Math.cos(rotation), part.cy + part.rx * Math.sin(rotation));
        ctx.ellipse(part.cx, part.cy, part.rx, part.ry, rotation, 0, Math.PI * 2);
      }
    }
  }
  ctx.stroke();
}

// ---------- SVG ----------

// Round to 2 decimal places, which keeps the file small without any visible difference
const round = (n: number) => Math.round(n * 100) / 100;

function partToSVG(part: ShapePart): string {
  if (part.kind === 'line') {
    return `<line x1="${round(part.x1)}" y1="${round(part.y1)}" x2="${round(part.x2)}" y2="${round(part.y2)}"/>`;
  }
  const cx = round(part.cx);
  const cy = round(part.cy);
  const rotate = part.rotation ? ` transform="rotate(${part.rotation} ${cx} ${cy})"` : '';
  return `<ellipse cx="${cx}" cy="${cy}" rx="${round(part.rx)}" ry="${round(part.ry)}"${rotate}/>`;
}

export function renderPatternSVG(width: number, height: number, config: PatternConfig): string {
  // Each copy of the shape becomes a group, so it can be selected as one piece in design apps
  const copies = getPatternShapes(width, height, config)
    .map((shape) => `<g>${shape.map(partToSVG).join('')}</g>`)
    .join('\n');

  const background = config.transparentBackground
    ? ''
    : `<rect width="${width}" height="${height}" fill="${config.backgroundColor}"/>\n`;

  const blurFilter =
    config.blur > 0
      ? `<defs><filter id="blur" filterUnits="userSpaceOnUse" x="0" y="0" width="${width}" height="${height}"><feGaussianBlur stdDeviation="${config.blur}"/></filter></defs>\n`
      : '';
  const blurAttribute = config.blur > 0 ? ' filter="url(#blur)"' : '';
  const dashAttribute = config.dashed
    ? ` stroke-dasharray="${config.dashLength} ${config.dashGap}"`
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
${blurFilter}${background}<g fill="none" stroke="${config.shapeColor}" stroke-width="${config.lineWidth}"${dashAttribute}${blurAttribute}>
${copies}
</g>
</svg>
`;
}
