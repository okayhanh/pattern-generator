// Reusable row of joined buttons where exactly one option is chosen

interface SegmentedControlProps<T extends string> {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div className="p-3 space-y-2">
      <div className="text-xs font-semibold uppercase tracking-wide">{label}</div>
      <div className="flex rounded border border-gray-700 overflow-hidden divide-x divide-gray-700">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            aria-pressed={value === option.value}
            className={`flex-1 py-1 text-xs transition ${
              value === option.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-gray-200'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
