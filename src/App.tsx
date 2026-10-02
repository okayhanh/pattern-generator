import { useRef } from 'react';
import { PatternCanvas } from './components/Canvas/PatternCanvas';
import { ShapeSelector } from './components/Controls/ShapeSelector';
import { Slider } from './components/Controls/Slider';
import { ExportControls } from './components/Controls/ExportControls';
import { usePatternStore } from './store/patternStore';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { gridMultiply, rotation, scale, updateConfig } = usePatternStore();

  return (
    <div className="w-full h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-700 px-6 py-4">
        <h1 className="text-3xl font-bold">Pattern Generator</h1>
        <p className="text-gray-400 text-sm mt-1">Create procedural textures and patterns</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden gap-6 p-6" style={{ display: 'flex', flexDirection: 'row' }}>
        {/* Sidebar Controls */}
        <div className="w-64 bg-gray-800 rounded-lg overflow-y-auto border border-gray-700">
          <ShapeSelector />
          
          <div className="p-4 border-b border-gray-700">
            <Slider
              label="Grid Multiply"
              value={gridMultiply}
              min={1}
              max={20}
              onChange={(val) => updateConfig('gridMultiply', val)}
            />
            <Slider
              label="Rotation"
              value={rotation}
              min={0}
              max={360}
              onChange={(val) => updateConfig('rotation', val)}
            />
            <Slider
              label="Scale"
              value={scale}
              min={0.5}
              max={3}
              step={0.1}
              onChange={(val) => updateConfig('scale', val)}
            />
          </div>
        </div>

        {/* Canvas Preview */}
        <div className="flex-1 bg-gray-800 rounded-lg overflow-hidden border border-gray-700 flex flex-col">
          <PatternCanvas canvasRef={canvasRef} />
          <ExportControls canvasRef={canvasRef} />
        </div>
      </div>
    </div>
  );
}