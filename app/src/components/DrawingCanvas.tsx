'use client';

import React, { useRef, useEffect, useState } from "react";
import { Point, DrawingStroke, Drawing } from "@/shared/types";
import { drawingApi } from "@/services/api";
import { v4 as uuidv4 } from "uuid";
import { Navigation } from './Navigation';
import { contentModerationService, ModerationResult } from '@/services/contentModeration';

export const DrawingCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const [strokes, setStrokes] = useState<DrawingStroke[]>([]);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(2);
  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingModel, setIsLoadingModel] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [lastModerationResult, setLastModerationResult] = useState<ModerationResult | null>(null);

  const colors = [
    "#000000",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
  ];

  // Initialize NSFW model
  useEffect(() => {
    const initializeModel = async () => {
      setIsLoadingModel(true);
      try {
        await contentModerationService.initialize();
        setModelReady(true);
      } catch (error) {
        console.error('Failed to initialize content moderation:', error);
        setModelReady(false);
      } finally {
        setIsLoadingModel(false);
      }
    };

    initializeModel();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Set drawing properties
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = brushSize;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Redraw all strokes
    strokes.forEach((stroke) => {
      if (stroke.points.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.width;
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

        for (let i = 1; i < stroke.points.length; i++) {
          ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
        }
        ctx.stroke();
      }
    });

    // Draw current stroke
    if (currentStroke.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = brushSize;
      ctx.moveTo(currentStroke[0].x, currentStroke[0].y);

      for (let i = 1; i < currentStroke.length; i++) {
        ctx.lineTo(currentStroke[i].x, currentStroke[i].y);
      }
      ctx.stroke();
    }
  }, [strokes, currentStroke, selectedColor, brushSize]);

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const point = getMousePos(e);
    setCurrentStroke([point]);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const point = getMousePos(e);
    setCurrentStroke((prev) => [...prev, point]);
  };

  const stopDrawing = () => {
    if (!isDrawing || currentStroke.length === 0) return;

    const newStroke: DrawingStroke = {
      id: uuidv4(),
      points: currentStroke,
      color: selectedColor,
      width: brushSize,
      timestamp: Date.now(),
    };

    setStrokes((prev) => [...prev, newStroke]);
    setCurrentStroke([]);
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    setStrokes([]);
    setCurrentStroke([]);
    setLastModerationResult(null);
  };

  const moderateContent = async (): Promise<ModerationResult | null> => {
    if (!modelReady || !canvasRef.current) {
      return null;
    }

    try {
      const result = await contentModerationService.moderateCanvas(canvasRef.current);
      setLastModerationResult(result);
      return result;
    } catch (error) {
      console.error('Content moderation failed:', error);
      return null;
    }
  };

  const saveDrawing = async () => {
    if (!title.trim()) {
      alert("Please enter a title for your drawing");
      return;
    }

    if (strokes.length === 0) {
      alert("Please draw something before saving");
      return;
    }

    setIsSaving(true);

    try {
      // Check content moderation if model is ready
      if (modelReady) {
        const moderationResult = await moderateContent();

        if (moderationResult && moderationResult.isNSFW) {
          const flaggedCategories = moderationResult.flaggedCategories.join(', ');
          const confidence = Math.round(moderationResult.confidence * 100);

          alert(
            `⚠️ Content Warning: Your drawing contains inappropriate content and cannot be saved.\n\n` +
            `Flagged categories: ${flaggedCategories}\n` +
            `Confidence: ${confidence}%\n\n` +
            `Please create appropriate content only.`
          );
          setIsSaving(false);
          return;
        }
      }

      const response = await drawingApi.createDrawing({
        title: title.trim(),
        strokes,
        author: "Anonymous",
      });

      if (response.success) {
        alert("Drawing saved successfully!");
        setTitle("");
        clearCanvas();
      } else {
        alert("Failed to save drawing: " + response.error);
      }
    } catch (error) {
      console.error("Error saving drawing:", error);
      alert("Failed to save drawing. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
              Drawing Canvas
            </h1>

      {/* Drawing Tools */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter drawing title"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Colors:
            </label>
            <div className="flex gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColor === color
                      ? "border-gray-800"
                      : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brush Size: {brushSize}px
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-20"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={clearCanvas}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Clear
            </button>

            {modelReady && (
              <button
                onClick={moderateContent}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                disabled={strokes.length === 0}
              >
                Check Content
              </button>
            )}

            <button
              onClick={saveDrawing}
              disabled={isSaving || strokes.length === 0}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Drawing"}
            </button>
          </div>
        </div>
      </div>

      {/* Content Moderation Status */}
      {isLoadingModel && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            <span className="text-blue-700">Loading content moderation system...</span>
          </div>
        </div>
      )}

      {modelReady && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-700 text-sm">Content moderation active</span>
          </div>
        </div>
      )}

      {lastModerationResult && (
        <div className={`mb-4 p-4 rounded-lg border ${
          lastModerationResult.isNSFW
            ? 'bg-red-50 border-red-200'
            : 'bg-green-50 border-green-200'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <span className={`font-semibold ${
              lastModerationResult.isNSFW ? 'text-red-700' : 'text-green-700'
            }`}>
              {lastModerationResult.isNSFW ? '⚠️ Content Warning' : '✅ Content Approved'}
            </span>
          </div>

          {lastModerationResult.isNSFW && (
            <div className="text-sm text-red-600 mb-2">
              Flagged categories: {lastModerationResult.flaggedCategories.join(', ')}
            </div>
          )}

          <div className="text-xs text-gray-600">
            <details>
              <summary className="cursor-pointer hover:text-gray-800">
                View detailed analysis
              </summary>
              <div className="mt-2 space-y-1">
                {lastModerationResult.predictions.map((pred, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{pred.className}:</span>
                    <span>{Math.round(pred.probability * 100)}%</span>
                  </div>
                ))}
              </div>
            </details>
          </div>
        </div>
      )}

      {/* Canvas */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="border border-gray-300 rounded cursor-crosshair"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </div>

      <div className="mt-4 text-sm text-gray-600 text-center">
        Click and drag to draw. Use the tools above to customize your drawing.
      </div>
          </div>
        </main>
      </div>
    </>
  );
};
