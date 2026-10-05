// Reusable checkbox component

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Checkbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <label className="p-3 flex items-center justify-between text-xs cursor-pointer">
      <span className="font-semibold uppercase tracking-wide">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 cursor-pointer accent-blue-600"
      />
    </label>
  );
}
