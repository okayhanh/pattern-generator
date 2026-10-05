import { usePatternStore } from '../../store/patternStore';
import { renderPattern, renderPatternSVG } from '../../utils/renderPattern';

// Every download covers this many pixels wide and tall, no matter the screen or window size
const EXPORT_SIZE = 2000;

export function ExportControls() {
  const config = usePatternStore();

  // resolution: 1 for a normal PNG, 2 for a PNG with twice the pixels in each direction
  const downloadPNG = (resolution: number) => {
    // Draw onto a separate canvas that's never shown on the page
    const canvas = document.createElement('canvas');
    canvas.width = EXPORT_SIZE * resolution;
    canvas.height = EXPORT_SIZE * resolution;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Same pattern, same area, just drawn with more pixels
    ctx.scale(resolution, resolution);
    renderPattern(ctx, EXPORT_SIZE, EXPORT_SIZE, config);

    const suffix = resolution === 1 ? '' : `@${resolution}x`;
    canvas.toBlob((blob) => {
      if (blob) downloadFile(blob, `pattern-${Date.now()}${suffix}.png`);
    });
  };

  const downloadSVG = () => {
    const svgText = renderPatternSVG(EXPORT_SIZE, EXPORT_SIZE, config);
    const blob = new Blob([svgText], { type: 'image/svg+xml' });
    downloadFile(blob, `pattern-${Date.now()}.svg`);
  };

  const buttonClass =
    'bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition';

  return (
    <div className="p-4 space-y-2">
      <p className="text-xs text-gray-400">
        Download ({EXPORT_SIZE} × {EXPORT_SIZE} area)
      </p>
      <div className="grid grid-cols-3 gap-2">
        <button onClick={() => downloadPNG(1)} className={buttonClass}>
          ↓ PNG
        </button>
        <button onClick={() => downloadPNG(2)} className={buttonClass}>
          ↓ PNG @2x
        </button>
        <button onClick={downloadSVG} className={buttonClass}>
          ↓ SVG
        </button>
      </div>
    </div>
  );
}

// Saves a file to the user's computer by clicking a temporary, invisible link
function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
