import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email/send';
import { welcomeEmailTemplate } from '@/lib/email/templates';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, lastName } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if already subscribed
    const existing = await prisma.subscriber.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      if (existing.isVerified && existing.isActive) {
        return NextResponse.json(
          { message: 'You are already subscribed to the Morning Briefing!' },
          { status: 200 }
        );
      }

      // Re-send verification if not verified
      if (!existing.isVerified) {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        const verifyUrl = `${siteUrl}/api/newsletter/verify/${existing.verifyToken}`;

        await sendEmail({
          to: normalizedEmail,
          subject: 'Confirm your Morning Briefing subscription',
          html: welcomeEmailTemplate(verifyUrl),
        });

        return NextResponse.json({
          message: 'Verification email resent. Please check your inbox.',
        });
      }
    }

    // Create new subscriber
    const verifyToken = crypto.randomBytes(32).toString('hex');
    const unsubscribeToken = crypto.randomBytes(32).toString('hex');

    await prisma.subscriber.create({
      data: {
        email: normalizedEmail,
        firstName: firstName || null,
        lastName: lastName || null,
        verifyToken,
        unsubscribeToken,
        preferences: ['morning_briefing'],
        isVerified: false,
        isActive: true,
      },
    });

    // Send verification email
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const verifyUrl = `${siteUrl}/api/newsletter/verify/${verifyToken}`;

    const emailResult = await sendEmail({
      to: normalizedEmail,
      subject: 'Confirm your Morning Briefing subscription',
      html: welcomeEmailTemplate(verifyUrl),
    });

    // Log the email
    await prisma.emailLog.create({
      data: {
        email: normalizedEmail,
        subject: 'Confirm your Morning Briefing subscription',
        type: 'welcome',
        status: emailResult.success ? 'sent' : 'failed',
        messageId: emailResult.messageId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Please check your email to confirm your subscription.',
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to process subscription' },
      { status: 500 }
    );
  }
}
