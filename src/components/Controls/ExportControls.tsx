interface ExportControlsProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export function ExportControls({ canvasRef }: ExportControlsProps) {
  const downloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pattern-${Date.now()}.png`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="p-4">
      <button
        onClick={downloadPNG}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
      >
        ↓ Download PNG
      </button>
    </div>
  );
}