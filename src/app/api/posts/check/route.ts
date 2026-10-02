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
  'after', 'over', 'into', 'about', 'bellingham', 'whatcom', 'county',
  'city', 'wa', 'washington', 'local', 'area', 'news',
]);

function extractKeywords(text: string): Set<string> {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter((word) => word.length > 3 && !STOP_WORDS.has(word));
  return new Set(words);
}

function jaccardSimilarity(set1: Set<string>, set2: Set<string>): number {
  if (set1.size === 0 || set2.size === 0) return 0;

  let intersection = 0;
  for (const word of set1) {
    if (set2.has(word)) intersection++;
  }

  const union = set1.size + set2.size - intersection;
  return union > 0 ? intersection / union : 0;
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
    const { title, hours = 168, threshold = 0.4 } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Get posts from the last N hours
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

    const recentPosts = await prisma.post.findMany({
      where: {
        createdAt: { gte: since }
      },
      select: {
        id: true,
        title: true,
        slug: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const inputKeywords = extractKeywords(title);

    // Check for duplicates
    let isDuplicate = false;
    let bestMatch: {
      id: string;
      title: string;
      slug: string;
      similarity: number;
    } | null = null;
    let highestSimilarity = 0;

    for (const post of recentPosts) {
      const postKeywords = extractKeywords(post.title);
      const similarity = jaccardSimilarity(inputKeywords, postKeywords);

      if (similarity > highestSimilarity) {
        highestSimilarity = similarity;
        bestMatch = {
          id: post.id,
          title: post.title,
          slug: post.slug,
          similarity: Math.round(similarity * 100)
        };
      }

      if (similarity >= threshold) {
        isDuplicate = true;
        break;
      }
    }

    return NextResponse.json({
      isDuplicate,
      similarity: Math.round(highestSimilarity * 100),
      threshold: Math.round(threshold * 100),
      bestMatch: isDuplicate ? bestMatch : null,
      checkedPosts: recentPosts.length
    });

  } catch (error) {
    console.error('Duplicate check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
