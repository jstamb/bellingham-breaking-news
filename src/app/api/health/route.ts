import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET - Health check endpoint
export async function GET() {
  const startTime = Date.now();

  try {
    // Check database connectivity
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbLatency = Date.now() - dbStart;

    // Get some stats
    const [postCount, breakingCount] = await Promise.all([
      prisma.post.count({ where: { isPublished: true } }),
      prisma.post.count({ where: { isPublished: true, isBreaking: true } }),
    ]);

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        status: 'connected',
        latency: `${dbLatency}ms`,
      },
      stats: {
        publishedPosts: postCount,
        breakingNews: breakingCount,
      },
      responseTime: `${Date.now() - startTime}ms`,
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Database connection failed',
        responseTime: `${Date.now() - startTime}ms`,
      },
      { status: 503 }
    );
  }
}
