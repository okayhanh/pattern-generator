//This store is the single source of truth for your entire app. Any component that needs pattern data imports this store and gets real-time updates.

import { create } from 'zustand';
import type { PatternState, PatternConfig } from '../types/pattern';

// these are the values users see before they change anything
const defaultConfig: PatternConfig = {
  baseShape: 'line',
  gridMultiply: 5,
  gridOffset: { x: 0, y: 0 },
  rotation: 0,
  scale: 1,
  stretch: { x: 1, y: 1 },
  shapeColor: '#ffffff',
  backgroundColor: '#000000',
  blur: 0,
  distortion: 0,
};

export const usePatternStore = create<PatternState>((set) => ({
  ...defaultConfig,
  
  updateConfig: (key, value) =>
    set((state) => ({
      ...state,
      [key]: value,
    })),
  
  resetToDefaults: () => set(defaultConfig),
}));