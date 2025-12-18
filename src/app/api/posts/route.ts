import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { validateApiKey } from '@/lib/api-auth';
import { generateSlug } from '@/lib/utils';

// GET - List posts (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const category = searchParams.get('category');
    const breaking = searchParams.get('breaking');

    const where: Record<string, unknown> = { isPublished: true };
    if (category) where.category = { equals: category, mode: 'insensitive' };
    if (breaking === 'true') where.isBreaking = true;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          featuredImage: true,
          imageAlt: true,
          category: true,
          tags: true,
          author: true,
          isBreaking: true,
          publishedAt: true,
          viewCount: true,
        },
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + posts.length < total,
      },
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// POST - Create post (requires API key)
export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get('X-API-Key');
    const isValid = await validateApiKey(apiKey);

    if (!isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, excerpt, category, tags, author, featuredImage, imageAlt, isBreaking, isPublished, metaTitle, metaDescription, publishedAt } = body;

    // Validate required fields
    if (!title || !content || !excerpt || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, excerpt, category' },
        { status: 400 }
      );
    }

    // Generate unique slug
    let slug = generateSlug(title);
    let slugExists = await prisma.post.findUnique({ where: { slug } });
    let counter = 1;
    while (slugExists) {
      slug = `${generateSlug(title)}-${counter}`;
      slugExists = await prisma.post.findUnique({ where: { slug } });
      counter++;
    }

    const post = await prisma.post.create({
      data: {
        slug,
        title,
        content,
        excerpt,
        category,
        tags: tags || [],
        author: author || 'Bellingham Breaking News Staff',
        featuredImage: featuredImage || null,
        imageAlt: imageAlt || null,
        isBreaking: isBreaking || false,
        isPublished: isPublished !== false,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      },
    });

    // Revalidate affected pages
    revalidatePath('/');
    revalidatePath('/news');
    revalidatePath(`/news/${slug}`);
    revalidatePath(`/category/${category.toLowerCase()}`);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    return NextResponse.json({
      success: true,
      post: {
        id: post.id,
        slug: post.slug,
        url: `${siteUrl}/news/${post.slug}`,
      },
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
