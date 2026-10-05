// Every shape the app can draw. To add a shape, add one entry to SHAPES:
// its button, icon, preview, PNG and SVG all come from that entry automatically.

// The building blocks every shape is made of
export type ShapePart =
  | { kind: 'line'; x1: number; y1: number; x2: number; y2: number }
  | { kind: 'ellipse'; cx: number; cy: number; rx: number; ry: number; rotation: number };

// The area a shape is drawn in: one cell, minus a little padding
interface Box {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

const line = (x1: number, y1: number, x2: number, y2: number): ShapePart => ({
  kind: 'line',
  x1,
  y1,
  x2,
  y2,
});

// Buttons appear in this order
export const SHAPES = {
  line: (b: Box) => [line(b.left, b.centerY, b.right, b.centerY)],

  plus: (b: Box) => [
    line(b.centerX, b.top, b.centerX, b.bottom),
    line(b.left, b.centerY, b.right, b.centerY),
  ],

  // Three lines through the center, 60° apart, make a six-armed asterisk
  asterisk: (b: Box) =>
    [90, 150, 210].map((degrees) => {
      const angle = (degrees * Math.PI) / 180;
      const dx = Math.cos(angle) * (b.width / 2);
      const dy = Math.sin(angle) * (b.height / 2);
      return line(b.centerX - dx, b.centerY - dy, b.centerX + dx, b.centerY + dy);
    }),

  circle: (b: Box): ShapePart[] => [
    { kind: 'ellipse', cx: b.centerX, cy: b.centerY, rx: b.width / 2, ry: b.height / 2, rotation: 0 },
  ],
};

export type ShapeType = keyof typeof SHAPES;

export const SHAPE_NAMES = Object.keys(SHAPES) as ShapeType[];

// The shape's parts, sized to fit a square cell of this many pixels
export function getShapeParts(shape: ShapeType, cellSize: number): ShapePart[] {
  const padding = 5;
  const size = cellSize - padding * 2;
  return SHAPES[shape]({
    left: padding,
    top: padding,
    right: padding + size,
    bottom: padding + size,
    width: size,
    height: size,
    centerX: cellSize / 2,
    centerY: cellSize / 2,
  });
}
