import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Drawing, CreateDrawingRequest, ApiResponse } from '../../../shared/types';

const router = Router();

// In-memory storage (replace with database in production)
let drawings: Drawing[] = [
  {
    id: '1',
    title: 'Sample Drawing',
    strokes: [
      {
        id: 'stroke1',
        points: [
          { x: 100, y: 100 },
          { x: 200, y: 150 },
          { x: 300, y: 200 }
        ],
        color: '#000000',
        width: 2,
        timestamp: Date.now()
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: 'Demo User'
  }
];

// GET /api/drawings - Get all drawings
router.get('/', (req, res) => {
  const response: ApiResponse<Drawing[]> = {
    success: true,
    data: drawings
  };
  res.json(response);
});

// GET /api/drawings/:id - Get specific drawing
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const drawing = drawings.find(d => d.id === id);

  if (!drawing) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Drawing not found'
    };
    return res.status(404).json(response);
  }

  const response: ApiResponse<Drawing> = {
    success: true,
    data: drawing
  };
  res.json(response);
});

// POST /api/drawings - Create new drawing
router.post('/', (req, res) => {
  try {
    const { title, strokes, author }: CreateDrawingRequest = req.body;

    if (!title || !strokes || !Array.isArray(strokes)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid request: title and strokes are required'
      };
      return res.status(400).json(response);
    }

    const newDrawing: Drawing = {
      id: uuidv4(),
      title,
      strokes,
      author,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    drawings.push(newDrawing);

    const response: ApiResponse<Drawing> = {
      success: true,
      data: newDrawing
    };

    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Internal server error'
    };
    res.status(500).json(response);
  }
});

// DELETE /api/drawings/:id - Delete drawing
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const index = drawings.findIndex(d => d.id === id);

  if (index === -1) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Drawing not found'
    };
    return res.status(404).json(response);
  }

  drawings.splice(index, 1);

  const response: ApiResponse<null> = {
    success: true
  };
  res.json(response);
});

export { router as drawingRoutes };