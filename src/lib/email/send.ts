const RESEND_API_URL = 'https://api.resend.com/emails';

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL || 'Bellingham Breaking News <news@bellinghambreakingnews.com>';

  if (!apiKey || apiKey === 're_PLACEHOLDER_KEY') {
    console.warn('Resend API key not configured - email not sent');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const response = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        reply_to: options.replyTo,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend API error:', data);
      return { success: false, error: data.message || 'Failed to send email' };
    }

    return { success: true, messageId: data.id };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

export async function sendBatchEmails(
  emails: Array<{ to: string; subject: string; html: string }>
): Promise<{ sent: number; failed: number }> {
  const results = { sent: 0, failed: 0 };

  // Send in batches of 10 to avoid rate limits
  const batchSize = 10;
  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize);
    const promises = batch.map((email) => sendEmail(email));
    const batchResults = await Promise.all(promises);

    batchResults.forEach((result) => {
      if (result.success) {
        results.sent++;
      } else {
        results.failed++;
      }
    });

    // Small delay between batches
    if (i + batchSize < emails.length) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return results;
}
