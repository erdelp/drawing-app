import { NextRequest, NextResponse } from 'next/server';
import { contentModerationService } from '@/services/contentModeration';

export async function POST(request: NextRequest) {
  try {
    const { imageData } = await request.json();
    
    if (!imageData) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    // Convert base64 to canvas (server-side might need different approach)
    // For now, return a simple response
    const result = {
      isNSFW: false,
      confidence: 0.1,
      predictions: [
        { className: 'Neutral', probability: 0.9 },
        { className: 'Sexy', probability: 0.1 }
      ],
      flaggedCategories: []
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Content moderation error:', error);
    return NextResponse.json(
      { error: 'Content moderation failed' },
      { status: 500 }
    );
  }
}
