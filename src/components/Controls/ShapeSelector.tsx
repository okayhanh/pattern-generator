// This is where we build the UI that lets users change the pattern.

import { usePatternStore } from '../../store/patternStore';
import type { PatternConfig } from '../../types/pattern';

export function ShapeSelector() {
  const { baseShape, updateConfig } = usePatternStore();
  const shapes = ['line', 'plus', 'asterisk', 'circle'] as const;

  return (
    <div className="p-4 border-b border-gray-700">
      <h3 className="text-sm font-bold mb-3 uppercase tracking-wide">Shape</h3>
      <div className="grid grid-cols-4 gap-2">
        {shapes.map((shape) => (
          <button
            key={shape}
            onClick={() => updateConfig('baseShape', shape)}
            title={shape}
            aria-label={shape}
            className={`p-2 border rounded flex items-center justify-center transition ${
              baseShape === shape
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-200'
            }`}
          >
            <ShapeIcon shape={shape} />
          </button>
        ))}
      </div>
    </div>
  );
}

// Small drawing of each shape, matching how it's drawn in the pattern
function ShapeIcon({ shape }: { shape: PatternConfig['baseShape'] }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      {shape === 'line' && <line x1="3" y1="12" x2="21" y2="12" />}

      {shape === 'plus' && (
        <>
          <line x1="12" y1="3" x2="12" y2="21" />
          <line x1="3" y1="12" x2="21" y2="12" />
        </>
      )}

      {shape === 'asterisk' && (
        <>
          <line x1="12" y1="3" x2="12" y2="21" />
          <line x1="19.8" y1="7.5" x2="4.2" y2="16.5" />
          <line x1="19.8" y1="16.5" x2="4.2" y2="7.5" />
        </>
      )}

      {shape === 'circle' && <circle cx="12" cy="12" r="9" />}
    </svg>
  );
}
