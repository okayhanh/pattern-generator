// Reusable color picker component

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function ColorPicker({ label, value, onChange, disabled = false }: ColorPickerProps) {
  return (
    <label
      className={`p-3 flex items-center justify-between text-xs ${
        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      <span className="font-semibold uppercase tracking-wide">{label}</span>
      <span className="flex items-center gap-2">
        <span className="text-gray-400 font-mono">{value}</span>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-8 h-8 rounded bg-transparent border border-gray-600 cursor-pointer disabled:cursor-not-allowed"
        />
      </span>
    </label>
  );
}
