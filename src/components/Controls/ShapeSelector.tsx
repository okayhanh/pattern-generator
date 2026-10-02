// This is where we build the UI that lets users change the pattern.

import { usePatternStore } from '../../store/patternStore';

export function ShapeSelector() {
  const { baseShape, updateConfig } = usePatternStore();
  const shapes = ['line', 'plus', 'asterisk', '0', '1'] as const;

  return (
    <div className="p-4 border-b border-gray-700">
      <h3 className="text-sm font-bold mb-3 uppercase tracking-wide">Shape</h3>
      <div className="grid grid-cols-5 gap-2">
        {shapes.map((shape) => (
          <button
            key={shape}
            onClick={() => updateConfig('baseShape', shape)}
            className={`p-2 border rounded text-sm font-mono transition ${
              baseShape === shape
                ? 'bg-blue-600 border-blue-500'
                : 'bg-gray-800 border-gray-700 hover:border-gray-600'
            }`}
          >
            {shape === '0' || shape === '1' ? shape : shape.slice(0, 1).toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}