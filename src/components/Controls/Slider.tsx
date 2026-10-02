// Reusable slider component

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}

export function Slider({ label, value, min, max, step = 1, onChange }: SliderProps) {
  return (
    <div className="p-3 space-y-2">
      <div className="flex justify-between text-xs">
        <label className="font-semibold uppercase tracking-wide">{label}</label>
        <span className="text-gray-400">{value}</span>
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