import { NextRequest, NextResponse } from 'next/server';
import { Drawing, ApiResponse } from '@/shared/types';
import { dbService } from '@/services/database';

// GET /api/drawings/[id] - Get specific drawing
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const drawing = await dbService.getDrawingById(id);

    if (!drawing) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Drawing not found',
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<Drawing> = {
      success: true,
      data: drawing,
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching drawing:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch drawing',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// DELETE /api/drawings/[id] - Delete drawing
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const deleted = await dbService.deleteDrawing(id);

    if (!deleted) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Drawing not found',
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<null> = {
      success: true,
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error deleting drawing:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to delete drawing',
    };
    return NextResponse.json(response, { status: 500 });
  }
}
