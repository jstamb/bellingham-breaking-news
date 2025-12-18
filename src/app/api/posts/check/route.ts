import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { validateApiKey } from '@/lib/api-auth';

// Common words to filter out for keyword comparison
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
  'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought',
  'used', 'it', 'its', 'this', 'that', 'these', 'those', 'i', 'you', 'he',
  'she', 'we', 'they', 'what', 'which', 'who', 'whom', 'whose', 'where',
  'when', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more',
  'most', 'other', 'some', 'such', 'no', 'not', 'only', 'own', 'same',
  'than', 'too', 'very', 'just', 'also', 'now', 'new', 'says', 'said',
]);

function extractKeywords(text: string): Set<string> {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
  return new Set(words);
}

function jaccardSimilarity(set1: Set<string>, set2: Set<string>): number {
  const intersection = new Set([...set1].filter((x) => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return union.size === 0 ? 0 : intersection.size / union.size;
}

// POST - Check for duplicate/similar articles
export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get('X-API-Key');
    const isValid = await validateApiKey(apiKey);

    if (!isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, threshold = 0.4 } = body;

    if (!title && !content) {
      return NextResponse.json(
        { error: 'Provide title or content to check' },
        { status: 400 }
      );
    }

    const inputText = `${title || ''} ${content || ''}`;
    const inputKeywords = extractKeywords(inputText);

    // Get recent posts to compare against
    const recentPosts = await prisma.post.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
      take: 100,
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        publishedAt: true,
      },
    });

    const matches = recentPosts
      .map((post) => {
        const postText = `${post.title} ${post.excerpt}`;
        const postKeywords = extractKeywords(postText);
        const similarity = jaccardSimilarity(inputKeywords, postKeywords);
        const sharedKeywords = [...inputKeywords].filter((k) => postKeywords.has(k));
        return {
          ...post,
          similarity: Math.round(similarity * 100) / 100,
          sharedKeywords,
        };
      })
      .filter((match) => match.similarity >= threshold)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5);

    return NextResponse.json({
      isDuplicate: matches.length > 0 && matches[0].similarity >= 0.6,
      matches,
      threshold,
    });
  } catch (error) {
    console.error('Error checking duplicates:', error);
    return NextResponse.json({ error: 'Failed to check duplicates' }, { status: 500 });
  }
}
