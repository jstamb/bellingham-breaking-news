import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { validateApiKey } from '@/lib/api-auth';

// GET - Fetch single post (public)
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: { slug: params.slug },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

// PATCH - Update post (requires API key)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const apiKey = request.headers.get('X-API-Key');
    const isValid = await validateApiKey(apiKey);

    if (!isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const existingPost = await prisma.post.findUnique({
      where: { slug: params.slug },
    });

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const updatedPost = await prisma.post.update({
      where: { slug: params.slug },
      data: {
        title: body.title ?? existingPost.title,
        content: body.content ?? existingPost.content,
        excerpt: body.excerpt ?? existingPost.excerpt,
        category: body.category ?? existingPost.category,
        tags: body.tags ?? existingPost.tags,
        author: body.author ?? existingPost.author,
        featuredImage: body.featuredImage ?? existingPost.featuredImage,
        imageAlt: body.imageAlt ?? existingPost.imageAlt,
        isBreaking: body.isBreaking ?? existingPost.isBreaking,
        isPublished: body.isPublished ?? existingPost.isPublished,
        metaTitle: body.metaTitle ?? existingPost.metaTitle,
        metaDescription: body.metaDescription ?? existingPost.metaDescription,
      },
    });

    // Revalidate affected pages
    revalidatePath('/');
    revalidatePath('/news');
    revalidatePath(`/news/${params.slug}`);
    revalidatePath(`/category/${updatedPost.category.toLowerCase()}`);

    return NextResponse.json({ success: true, post: updatedPost });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

// DELETE - Delete post (requires API key)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const apiKey = request.headers.get('X-API-Key');
    const isValid = await validateApiKey(apiKey);

    if (!isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: { slug: params.slug },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    await prisma.post.delete({
      where: { slug: params.slug },
    });

    // Revalidate affected pages
    revalidatePath('/');
    revalidatePath('/news');
    revalidatePath(`/category/${post.category.toLowerCase()}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
