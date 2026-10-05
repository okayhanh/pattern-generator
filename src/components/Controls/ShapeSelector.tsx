// The shape buttons, plus the options for combining or alternating several shapes.

import { usePatternStore } from '../../store/patternStore';
import { getShapeParts, SHAPE_NAMES, type ShapeType } from '../../utils/shapes';
import { SegmentedControl } from './SegmentedControl';
import { Slider } from './Slider';

export function ShapeSelector() {
  const { shapes, shapeMode, alternatePattern, seed, updateConfig } = usePatternStore();

  const toggleShape = (shape: ShapeType) => {
    const isSelected = shapes.includes(shape);
    // Always keep at least one shape selected
    if (isSelected && shapes.length === 1) return;

    // Rebuild the list in button order, with this shape switched on or off
    updateConfig(
      'shapes',
      SHAPE_NAMES.filter((s) => (s === shape ? !isSelected : shapes.includes(s)))
    );
  };

  return (
    <div className="p-4 border-b border-gray-700">
      <h3 className="text-sm font-bold mb-3 uppercase tracking-wide">Shape</h3>
      <div className="grid grid-cols-4 gap-2">
        {SHAPE_NAMES.map((shape) => (
          <button
            key={shape}
            onClick={() => toggleShape(shape)}
            title={shape}
            aria-label={shape}
            aria-pressed={shapes.includes(shape)}
            className={`p-2 border rounded flex items-center justify-center transition ${
              shapes.includes(shape)
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-200'
            }`}
          >
            <ShapeIcon shape={shape} />
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-2">Click to select more than one</p>

      {shapes.length > 1 && (
        <div className="mt-2">
          <SegmentedControl
            label="Multiple Shapes"
            options={[
              { value: 'combine', label: 'Combine' },
              { value: 'alternate', label: 'Alternate' },
            ]}
            value={shapeMode}
            onChange={(val) => updateConfig('shapeMode', val)}
          />

          {shapeMode === 'alternate' && (
            <SegmentedControl
              label="Alternate By"
              options={[
                { value: 'cell', label: 'Cell' },
                { value: 'row', label: 'Row' },
                { value: 'column', label: 'Column' },
                { value: 'random', label: 'Random' },
              ]}
              value={alternatePattern}
              onChange={(val) => updateConfig('alternatePattern', val)}
            />
          )}

          {shapeMode === 'alternate' && alternatePattern === 'random' && (
            <Slider
              label="Seed"
              value={seed}
              min={1}
              max={100}
              onChange={(val) => updateConfig('seed', Math.round(val))}
            />
          )}
        </div>
      )}
    </div>
  );
}

// Small drawing of each shape, made from the same parts the pattern uses.
// The shape is drawn in a 28px cell (5px padding), and the view crops 2px off each side
// so it fills the icon nicely.
function ShapeIcon({ shape }: { shape: ShapeType }) {
  return (
    <svg viewBox="2 2 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
      {getShapeParts(shape, 28).map((part, i) =>
        part.kind === 'line' ? (
          <line key={i} x1={part.x1} y1={part.y1} x2={part.x2} y2={part.y2} />
        ) : (
          <ellipse key={i} cx={part.cx} cy={part.cy} rx={part.rx} ry={part.ry} />
        )
      )}
    </svg>
  );
}
