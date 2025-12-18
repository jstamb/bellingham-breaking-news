import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email/send';
import { unsubscribeConfirmationTemplate } from '@/lib/email/templates';

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const subscriber = await prisma.subscriber.findUnique({
      where: { unsubscribeToken: params.token },
    });

    if (!subscriber) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      return NextResponse.redirect(`${siteUrl}?error=invalid-token`);
    }

    // Deactivate the subscriber
    await prisma.subscriber.update({
      where: { id: subscriber.id },
      data: {
        isActive: false,
      },
    });

    // Send unsubscribe confirmation
    await sendEmail({
      to: subscriber.email,
      subject: 'You have been unsubscribed',
      html: unsubscribeConfirmationTemplate(),
    });

    // Redirect to confirmation
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    return NextResponse.redirect(`${siteUrl}?unsubscribed=true`);
  } catch (error) {
    console.error('Unsubscribe error:', error);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    return NextResponse.redirect(`${siteUrl}?error=unsubscribe-failed`);
  }
}
