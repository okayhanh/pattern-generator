import { PatternCanvas } from './components/Canvas/PatternCanvas';
import { ShapeSelector } from './components/Controls/ShapeSelector';
import { Slider } from './components/Controls/Slider';
import { ColorPicker } from './components/Controls/ColorPicker';
import { Checkbox } from './components/Controls/Checkbox';
import { ExportControls } from './components/Controls/ExportControls';
import { usePatternStore } from './store/patternStore';

export default function App() {
  const {
    gridMultiply,
    gridOffset,
    rotation,
    scale,
    lineWidth,
    dashed,
    dashLength,
    dashGap,
    shapeColor,
    backgroundColor,
    transparentBackground,
    updateConfig,
  } = usePatternStore();

  return (
    <div className="w-full h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-700 px-6 py-4">
        <h1 className="text-3xl font-bold text-white">Pattern Generator</h1>
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
              max={40}
              onChange={(val) => updateConfig('gridMultiply', val)}
            />
            <Slider
              label="Row Offset X (%)"
              value={gridOffset.x}
              min={0}
              max={100}
              onChange={(val) => updateConfig('gridOffset', { ...gridOffset, x: val })}
            />
            <Slider
              label="Row Offset Y (%)"
              value={gridOffset.y}
              min={0}
              max={100}
              onChange={(val) => updateConfig('gridOffset', { ...gridOffset, y: val })}
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

          <div className="p-4 border-b border-gray-700">
            <Slider
              label="Thickness (px)"
              value={lineWidth}
              min={0.25}
              max={10}
              step={0.25}
              onChange={(val) => updateConfig('lineWidth', val)}
            />
            <Checkbox
              label="Dashed Line"
              checked={dashed}
              onChange={(val) => updateConfig('dashed', val)}
            />
            {dashed && (
              <div className="ml-3 border-l border-gray-700">
                <Slider
                  label="Dash (px)"
                  value={dashLength}
                  min={1}
                  max={50}
                  onChange={(val) => updateConfig('dashLength', val)}
                />
                <Slider
                  label="Gap (px)"
                  value={dashGap}
                  min={1}
                  max={50}
                  onChange={(val) => updateConfig('dashGap', val)}
                />
              </div>
            )}
          </div>

          <div className="p-4 border-b border-gray-700">
            <ColorPicker
              label="Shape Color"
              value={shapeColor}
              onChange={(val) => updateConfig('shapeColor', val)}
            />
            <ColorPicker
              label="Background"
              value={backgroundColor}
              onChange={(val) => updateConfig('backgroundColor', val)}
              disabled={transparentBackground}
            />
            <Checkbox
              label="Transparent Background"
              checked={transparentBackground}
              onChange={(val) => updateConfig('transparentBackground', val)}
            />
          </div>
        </div>

        {/* Canvas Preview */}
        <div className="flex-1 bg-gray-800 rounded-lg overflow-hidden border border-gray-700 flex flex-col">
          <PatternCanvas />
          <ExportControls />
        </div>
      </div>
    </div>
  );
}