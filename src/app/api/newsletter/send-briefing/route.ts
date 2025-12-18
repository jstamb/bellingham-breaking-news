import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { validateApiKey } from '@/lib/api-auth';
import { sendEmail } from '@/lib/email/send';
import { weeklyBriefingTemplate } from '@/lib/email/templates';

// POST - Send weekly briefing to all active subscribers (protected)
// Designed to be triggered every Friday at 7am PT via n8n or Cloud Scheduler
export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get('X-API-Key');
    const isValid = await validateApiKey(apiKey);

    if (!isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // Get the week's top articles (last 7 days)
    const articles = await prisma.post.findMany({
      where: {
        isPublished: true,
        publishedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
      orderBy: [
        { isBreaking: 'desc' },
        { publishedAt: 'desc' },
      ],
      take: 15, // More articles for weekly digest
      select: {
        title: true,
        excerpt: true,
        category: true,
        slug: true,
        isBreaking: true,
      },
    });

    if (articles.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No articles to send - no new content in the last 7 days',
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
      isBreaking: article.isBreaking,
    }));

    // Send to each subscriber
    let sent = 0;
    let failed = 0;

    // Format date for subject line (e.g., "Dec 20")
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    for (const subscriber of subscribers) {
      const unsubscribeUrl = `${siteUrl}/api/newsletter/unsubscribe/${subscriber.unsubscribeToken}`;
      const html = weeklyBriefingTemplate(articleData, unsubscribeUrl);

      const result = await sendEmail({
        to: subscriber.email,
        subject: `Weekly Briefing - ${dateStr} | Bellingham Breaking News`,
        html,
      });

      // Log the email
      await prisma.emailLog.create({
        data: {
          email: subscriber.email,
          subject: `Weekly Briefing - ${dateStr}`,
          type: 'weekly_briefing',
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
    console.error('Send weekly briefing error:', error);
    return NextResponse.json(
      { error: 'Failed to send weekly briefing' },
      { status: 500 }
    );
  }
}
