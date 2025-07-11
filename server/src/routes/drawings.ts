import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import {
  Drawing,
  CreateDrawingRequest,
  ApiResponse,
} from "../../../shared/types";
import { dbService } from "../services/database";

const router = Router();

// GET /api/drawings - Get all drawings
router.get("/", async (req, res) => {
  try {
    const drawings = await dbService.getAllDrawings();
    const response: ApiResponse<Drawing[]> = {
      success: true,
      data: drawings,
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Failed to fetch drawings",
    };
    res.status(500).json(response);
  }
});

// GET /api/drawings/:id - Get specific drawing
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const drawing = await dbService.getDrawingById(id);

    if (!drawing) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Drawing not found",
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<Drawing> = {
      success: true,
      data: drawing,
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Failed to fetch drawing",
    };
    res.status(500).json(response);
  }
});

// POST /api/drawings - Create new drawing
router.post("/", async (req, res) => {
  try {
    const { title, strokes, author }: CreateDrawingRequest = req.body;

    if (!title || !strokes || !Array.isArray(strokes)) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Invalid request: title and strokes are required",
      };
      return res.status(400).json(response);
    }

    const newDrawing: Drawing = {
      id: uuidv4(),
      title,
      strokes,
      author,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const savedDrawing = await dbService.createDrawing(newDrawing);

    const response: ApiResponse<Drawing> = {
      success: true,
      data: savedDrawing,
    };

    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Failed to create drawing",
    };
    res.status(500).json(response);
  }
});

// DELETE /api/drawings/:id - Delete drawing
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await dbService.deleteDrawing(id);

    if (!deleted) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Drawing not found",
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<null> = {
      success: true,
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Failed to delete drawing",
    };
    res.status(500).json(response);
  }
});

export { router as drawingRoutes };