import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { validateApiKey } from '@/lib/api-auth';
import { sendEmail } from '@/lib/email/send';
import { morningBriefingTemplate } from '@/lib/email/templates';

// POST - Send morning briefing to all active subscribers (protected)
export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get('X-API-Key');
    const isValid = await validateApiKey(apiKey);

    if (!isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // Get today's top articles
    const articles = await prisma.post.findMany({
      where: {
        isPublished: true,
        publishedAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
      orderBy: [
        { isBreaking: 'desc' },
        { publishedAt: 'desc' },
      ],
      take: 10,
      select: {
        title: true,
        excerpt: true,
        category: true,
        slug: true,
      },
    });

    if (articles.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No articles to send - no new content in the last 24 hours',
      });
    }

    // Get active, verified subscribers
    const subscribers = await prisma.subscriber.findMany({
      where: {
        isActive: true,
        isVerified: true,
        preferences: { has: 'morning_briefing' },
      },
      select: {
        email: true,
        unsubscribeToken: true,
      },
    });

    if (subscribers.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No active subscribers to send to',
      });
    }

    // Prepare article data for template
    const articleData = articles.map((article) => ({
      title: article.title,
      excerpt: article.excerpt,
      category: article.category,
      url: `${siteUrl}/news/${article.slug}`,
    }));

    // Send to each subscriber
    let sent = 0;
    let failed = 0;

    for (const subscriber of subscribers) {
      const unsubscribeUrl = `${siteUrl}/api/newsletter/unsubscribe/${subscriber.unsubscribeToken}`;
      const html = morningBriefingTemplate(articleData, unsubscribeUrl);

      const result = await sendEmail({
        to: subscriber.email,
        subject: `Morning Briefing - ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
        html,
      });

      // Log the email
      await prisma.emailLog.create({
        data: {
          email: subscriber.email,
          subject: `Morning Briefing`,
          type: 'morning_briefing',
          status: result.success ? 'sent' : 'failed',
          messageId: result.messageId,
        },
      });

      // Update last email sent
      if (result.success) {
        sent++;
        await prisma.subscriber.update({
          where: { email: subscriber.email },
          data: { lastEmailSent: new Date() },
        });
      } else {
        failed++;
      }

      // Rate limiting - small delay between emails
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    return NextResponse.json({
      success: true,
      stats: {
        articlesIncluded: articles.length,
        subscribersTotal: subscribers.length,
        sent,
        failed,
      },
    });
  } catch (error) {
    console.error('Send briefing error:', error);
    return NextResponse.json(
      { error: 'Failed to send morning briefing' },
      { status: 500 }
    );
  }
}
