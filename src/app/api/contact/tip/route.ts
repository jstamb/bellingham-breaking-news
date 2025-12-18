import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface TipSubmission {
  name?: string;
  email?: string;
  phone?: string;
  subject: string;
  message: string;
  anonymous: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: TipSubmission = await request.json();
    const { name, email, phone, subject, message, anonymous } = body;

    // Validation
    if (!subject || !message) {
      return NextResponse.json(
        { error: 'Subject and message are required' },
        { status: 400 }
      );
    }

    if (!anonymous && (!name || !email)) {
      return NextResponse.json(
        { error: 'Name and email are required for non-anonymous submissions' },
        { status: 400 }
      );
    }

    // Build email content
    const submitterInfo = anonymous
      ? '<p><strong>Submitted anonymously</strong></p>'
      : `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
      `;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a1a2e; color: white; padding: 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 20px; }
          .content { padding: 30px 20px; background: #f8f9fa; }
          .info-box { background: white; padding: 20px; border-left: 4px solid #E63946; margin-bottom: 20px; }
          .message-box { background: white; padding: 20px; border: 1px solid #ddd; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .label { font-size: 11px; text-transform: uppercase; color: #888; letter-spacing: 1px; margin-bottom: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Tip Submission</h1>
          </div>
          <div class="content">
            <div class="info-box">
              <p class="label">Contact Information</p>
              ${submitterInfo}
            </div>

            <div class="info-box">
              <p class="label">Topic</p>
              <p><strong>${subject}</strong></p>
            </div>

            <div class="message-box">
              <p class="label">Message</p>
              <p>${message.replace(/\n/g, '<br>')}</p>
            </div>
          </div>
          <div class="footer">
            <p>Submitted via Bellingham Breaking News website</p>
            <p>${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })} PT</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email via Resend
    const { error } = await resend.emails.send({
      from: 'Bellingham Breaking News <tips@bellinghambreakingnews.com>',
      to: 'hello@stambaughdesigns.co',
      replyTo: anonymous ? undefined : email,
      subject: `[TIP] ${subject}${anonymous ? ' (Anonymous)' : ` - from ${name}`}`,
      html: htmlContent,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send tip. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Tip submitted successfully',
    });
  } catch (error) {
    console.error('Tip submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit tip. Please try again.' },
      { status: 500 }
    );
  }
}
