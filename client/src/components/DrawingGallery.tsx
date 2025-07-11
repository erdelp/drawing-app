import React, { useState, useEffect } from "react";
import { Drawing } from "../../../shared/types";
import { drawingApi } from "../services/api";
import { DrawingPreview } from "./DrawingPreview";

export const DrawingGallery: React.FC = () => {
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDrawings();
  }, []);

  const loadDrawings = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await drawingApi.getDrawings();

      if (response.success && response.data) {
        setDrawings(response.data);
      } else {
        setError(response.error || "Failed to load drawings");
      }
    } catch (err) {
      console.error("Error loading drawings:", err);
      setError("Failed to load drawings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteDrawing = async (id: string) => {
    if (!confirm("Are you sure you want to delete this drawing?")) {
      return;
    }

    try {
      const response = await drawingApi.deleteDrawing(id);

      if (response.success) {
        setDrawings((prev) => prev.filter((d) => d.id !== id));
      } else {
        alert("Failed to delete drawing: " + response.error);
      }
    } catch (error) {
      console.error("Error deleting drawing:", error);
      alert("Failed to delete drawing. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading drawings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <button
          onClick={loadDrawings}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Drawing Gallery
      </h1>

      {drawings.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg">No drawings yet!</p>
          <p className="mt-2">Create your first drawing to see it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drawings.map((drawing) => (
            <DrawingPreview
              key={drawing.id}
              drawing={drawing}
              onDelete={deleteDrawing}
            />
          ))}
        </div>
      )}
    </div>
  );
};
