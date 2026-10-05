// Resets every setting. Needs two clicks, so it can't happen by accident.

import { useEffect, useState } from 'react';
import { usePatternStore } from '../../store/patternStore';

// How long the button waits for the second click, in milliseconds
const CONFIRM_TIMEOUT = 3000;

export function ResetButton() {
  const { resetToDefaults } = usePatternStore();
  const [confirming, setConfirming] = useState(false);

  // If the second click doesn't come in time, go back to normal
  useEffect(() => {
    if (!confirming) return;
    const timer = setTimeout(() => setConfirming(false), CONFIRM_TIMEOUT);
    return () => clearTimeout(timer);
  }, [confirming]);

  const handleClick = () => {
    if (confirming) {
      resetToDefaults();
      setConfirming(false);
    } else {
      setConfirming(true);
    }
  };

  return (
    <button
      onClick={handleClick}
      onBlur={() => setConfirming(false)}
      className={`w-full py-2 text-xs font-semibold uppercase tracking-wide border rounded transition ${
        confirming
          ? 'text-red-300 border-red-500 bg-red-500/10 hover:bg-red-500/20'
          : 'text-gray-400 border-gray-700 hover:text-white hover:border-gray-500'
      }`}
    >
      {confirming ? 'Click again to reset' : '↺ Reset to Defaults'}
    </button>
  );
}
