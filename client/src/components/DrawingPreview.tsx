import React, { useRef, useEffect } from "react";
import { Drawing } from "../../../shared/types";

interface DrawingPreviewProps {
  drawing: Drawing;
  onDelete: (id: string) => void;
}

export const DrawingPreview: React.FC<DrawingPreviewProps> = ({
  drawing,
  onDelete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = 300;
    canvas.height = 200;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Scale factor to fit drawing in preview
    const scaleX = canvas.width / 800;
    const scaleY = canvas.height / 600;

    // Draw all strokes
    drawing.strokes.forEach((stroke) => {
      if (stroke.points.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.width * Math.min(scaleX, scaleY);

        const firstPoint = stroke.points[0];
        ctx.moveTo(firstPoint.x * scaleX, firstPoint.y * scaleY);

        for (let i = 1; i < stroke.points.length; i++) {
          const point = stroke.points[i];
          ctx.lineTo(point.x * scaleX, point.y * scaleY);
        }
        ctx.stroke();
      }
    });
  }, [drawing]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-48 object-cover border-b border-gray-200"
      />

      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 mb-2">
          {drawing.title}
        </h3>

        <div className="text-sm text-gray-600 mb-3">
          <p>Created: {new Date(drawing.createdAt).toLocaleDateString()}</p>
          {drawing.author && <p>By: {drawing.author}</p>}
          <p>Strokes: {drawing.strokes.length}</p>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {new Date(drawing.createdAt).toLocaleTimeString()}
          </span>

          <button
            onClick={() => onDelete(drawing.id)}
            className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
