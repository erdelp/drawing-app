export interface Point {
  x: number;
  y: number;
}

export interface DrawingStroke {
  id: string;
  points: Point[];
  color: string;
  width: number;
  timestamp: number;
}

export interface Drawing {
  id: string;
  title: string;
  strokes: DrawingStroke[];
  createdAt: string;
  updatedAt: string;
  author?: string;
}

export interface CreateDrawingRequest {
  title: string;
  strokes: DrawingStroke[];
  author?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}