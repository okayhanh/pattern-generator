// Reusable slider component, with a number box for typing exact values

import { useState } from 'react';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}

export function Slider({ label, value, min, max, step = 1, onChange }: SliderProps) {
  // What's typed in the box while editing; null when not editing
  const [draft, setDraft] = useState<string | null>(null);

  const handleType = (text: string) => {
    setDraft(text);
    // Update the pattern live, but only once the text is a number within range
    const num = parseFloat(text);
    if (!isNaN(num) && num >= min && num <= max) {
      onChange(num);
    }
  };

  // When the box loses focus, keep the number within range (or undo if it isn't a number)
  const finishTyping = () => {
    if (draft !== null) {
      const num = parseFloat(draft);
      if (!isNaN(num)) {
        onChange(Math.min(max, Math.max(min, num)));
      }
    }
    setDraft(null);
  };

  return (
    <div className="p-3 space-y-2">
      <div className="flex justify-between items-center text-xs">
        <label className="font-semibold uppercase tracking-wide">{label}</label>
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={draft ?? value}
          onChange={(e) => handleType(e.target.value)}
          onBlur={finishTyping}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.currentTarget.blur();
          }}
          className="w-16 px-1 py-0.5 text-right text-gray-300 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-blue-500"
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full"
      />
    </div>
  );
}
