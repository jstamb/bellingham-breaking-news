import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { validateApiKey } from '@/lib/api-auth';

// POST - Manually trigger revalidation
export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get('X-API-Key');
    const isValid = await validateApiKey(apiKey);

    if (!isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { path, tag, all } = body;

    if (all) {
      // Revalidate all main paths
      revalidatePath('/');
      revalidatePath('/news');
      revalidatePath('/category/[category]', 'page');
      revalidatePath('/news/[slug]', 'page');
      return NextResponse.json({ success: true, revalidated: 'all' });
    }

    if (path) {
      revalidatePath(path);
      return NextResponse.json({ success: true, revalidated: path });
    }

    if (tag) {
      revalidateTag(tag);
      return NextResponse.json({ success: true, revalidated: tag });
    }

    return NextResponse.json(
      { error: 'Provide path, tag, or set all: true' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error revalidating:', error);
    return NextResponse.json({ error: 'Failed to revalidate' }, { status: 500 });
  }
}
