import type { ShapeType } from '../utils/shapes';

export interface PatternConfig {
  // Shape
  shapes: ShapeType[]; // one or more, always kept in button order
  shapeMode: 'combine' | 'alternate'; // draw all shapes in every cell, or one per cell
  alternatePattern: 'cell' | 'row' | 'column' | 'random';
  seed: number; // fixes the Random arrangement so the same seed always gives the same layout

  // Transform
  gridMultiply: number;
  gridOffset: { x: number; y: number }; // shift of every other row, as % of a cell
  rotation: number;
  scale: number;
  stretch: { x: number; y: number };

  // Line (all in pixels, unaffected by Scale)
  lineWidth: number;
  dashed: boolean;
  dashLength: number;
  dashGap: number;

  // Style
  shapeColor: string;
  backgroundColor: string;
  transparentBackground: boolean;
  blur: number;
  distortion: number;

  // Image overlay
  imageOverlay?: {
    src: string;
    opacity: number;
  };
}

export interface PatternState extends PatternConfig {
  updateConfig: <K extends keyof PatternConfig>(key: K, value: PatternConfig[K]) => void;
  resetToDefaults: () => void;
}
