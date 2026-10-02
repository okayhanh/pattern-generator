export interface PatternConfig {
  // Shape
  baseShape: 'line' | 'plus' | 'asterisk' | '0' | '1';
  
  // Transform
  gridMultiply: number;
  gridOffset: { x: number; y: number };
  rotation: number;
  scale: number;
  stretch: { x: number; y: number };
  
  // Style
  shapeColor: string;
  backgroundColor: string;
  blur: number;
  distortion: number;
  
  // Image overlay
  imageOverlay?: {
    src: string;
    opacity: number;
  };
}

export interface PatternState extends PatternConfig {
updateConfig: <K extends keyof PatternConfig>(
  key: K,
  value: PatternConfig[K]
) => void;
}