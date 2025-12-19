import { NextRequest, NextResponse } from 'next/server';

// Test endpoint to verify content handling
// POST with any JSON body - returns what was received
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    return NextResponse.json({
      received: true,
      bodyKeys: Object.keys(body),
      contentLength: body.content?.length || 0,
      excerptLength: body.excerpt?.length || 0,
      contentPreview: body.content?.substring(0, 200) || null,
      contentEnd: body.content?.substring(body.content.length - 100) || null,
      fullBody: body, // Return full body for debugging
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to parse body',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 400 });
  }
}
