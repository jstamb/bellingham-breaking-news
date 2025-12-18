import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email/send';
import { verificationConfirmedTemplate } from '@/lib/email/templates';

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const subscriber = await prisma.subscriber.findUnique({
      where: { verifyToken: params.token },
    });

    if (!subscriber) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      return NextResponse.redirect(`${siteUrl}?error=invalid-token`);
    }

    if (subscriber.isVerified) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      return NextResponse.redirect(`${siteUrl}?message=already-verified`);
    }

    // Verify the subscriber
    await prisma.subscriber.update({
      where: { id: subscriber.id },
      data: {
        isVerified: true,
        verifyToken: null, // Clear the token after use
      },
    });

    // Send confirmation email
    const emailResult = await sendEmail({
      to: subscriber.email,
      subject: 'Welcome to the Morning Briefing!',
      html: verificationConfirmedTemplate(),
    });

    // Log the email
    await prisma.emailLog.create({
      data: {
        email: subscriber.email,
        subject: 'Welcome to the Morning Briefing!',
        type: 'verify',
        status: emailResult.success ? 'sent' : 'failed',
        messageId: emailResult.messageId,
      },
    });

    // Redirect to success page
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    return NextResponse.redirect(`${siteUrl}?subscribed=true`);
  } catch (error) {
    console.error('Verification error:', error);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    return NextResponse.redirect(`${siteUrl}?error=verification-failed`);
  }
}
