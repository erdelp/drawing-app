import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { Drawing, CreateDrawingRequest, ApiResponse } from '@/shared/types';
import { dbService } from '@/services/database';

// GET /api/drawings - Get all drawings
export async function GET() {
  try {
    const drawings = await dbService.getAllDrawings();
    const response: ApiResponse<Drawing[]> = {
      success: true,
      data: drawings,
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching drawings:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch drawings',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// POST /api/drawings - Create new drawing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, strokes, author }: CreateDrawingRequest = body;

    if (!title || !strokes || !Array.isArray(strokes)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid request: title and strokes are required',
      };
      return NextResponse.json(response, { status: 400 });
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

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating drawing:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to create drawing',
    };
    return NextResponse.json(response, { status: 500 });
  }
}
