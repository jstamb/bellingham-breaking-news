const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bellinghambreakingnews.com';
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Bellingham Breaking News';

const baseStyles = `
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
  .header { background: #1a237e; color: white; padding: 20px; text-align: center; }
  .header h1 { margin: 0; font-size: 24px; }
  .content { padding: 30px 20px; background: #ffffff; }
  .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; }
  .button { display: inline-block; background: #1a237e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
  .article { border-bottom: 1px solid #eee; padding: 15px 0; }
  .article h3 { margin: 0 0 8px 0; }
  .article p { margin: 0; color: #666; font-size: 14px; }
  .category { display: inline-block; background: #e3f2fd; color: #1a237e; padding: 2px 8px; border-radius: 3px; font-size: 11px; text-transform: uppercase; }
`;

export function welcomeEmailTemplate(verifyUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head><style>${baseStyles}</style></head>
<body>
  <div class="container">
    <div class="header">
      <h1>${siteName}</h1>
    </div>
    <div class="content">
      <h2>Welcome to the Morning Briefing!</h2>
      <p>Thank you for subscribing to the ${siteName} Morning Briefing. You'll receive our daily digest of the most important local news every morning.</p>
      <p>Please confirm your email address to start receiving updates:</p>
      <p style="text-align: center;">
        <a href="${verifyUrl}" class="button">Confirm Email Address</a>
      </p>
      <p style="font-size: 14px; color: #666;">If you didn't subscribe to this newsletter, you can safely ignore this email.</p>
    </div>
    <div class="footer">
      <p>${siteName}<br>Bellingham, WA</p>
      <p><a href="${siteUrl}">Visit our website</a></p>
    </div>
  </div>
</body>
</html>`;
}

export function verificationConfirmedTemplate(): string {
  return `
<!DOCTYPE html>
<html>
<head><style>${baseStyles}</style></head>
<body>
  <div class="container">
    <div class="header">
      <h1>${siteName}</h1>
    </div>
    <div class="content">
      <h2>You're All Set!</h2>
      <p>Your email has been confirmed. You'll now receive our Morning Briefing with the top Bellingham news delivered to your inbox each day.</p>
      <p>Here's what you can expect:</p>
      <ul>
        <li>Daily digest of top local stories</li>
        <li>Breaking news alerts for major events</li>
        <li>Weekend roundups and special reports</li>
      </ul>
      <p style="text-align: center;">
        <a href="${siteUrl}" class="button">Read Latest News</a>
      </p>
    </div>
    <div class="footer">
      <p>${siteName}<br>Bellingham, WA</p>
    </div>
  </div>
</body>
</html>`;
}

interface ArticleDigest {
  title: string;
  excerpt: string;
  category: string;
  url: string;
}

export function morningBriefingTemplate(
  articles: ArticleDigest[],
  unsubscribeUrl: string
): string {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const articleHtml = articles
    .map(
      (article) => `
    <div class="article">
      <span class="category">${article.category}</span>
      <h3><a href="${article.url}" style="color: #1a237e; text-decoration: none;">${article.title}</a></h3>
      <p>${article.excerpt}</p>
    </div>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head><style>${baseStyles}</style></head>
<body>
  <div class="container">
    <div class="header">
      <h1>${siteName}</h1>
      <p style="margin: 5px 0 0 0; font-size: 14px;">Morning Briefing</p>
    </div>
    <div class="content">
      <p style="color: #666; font-size: 14px;">${today}</p>
      <h2>Good morning, Bellingham!</h2>
      <p>Here are today's top stories from around Whatcom County:</p>

      ${articleHtml}

      <p style="text-align: center; margin-top: 30px;">
        <a href="${siteUrl}" class="button">Read More on Our Website</a>
      </p>
    </div>
    <div class="footer">
      <p>${siteName}<br>Bellingham, WA</p>
      <p><a href="${unsubscribeUrl}">Unsubscribe</a> from the Morning Briefing</p>
    </div>
  </div>
</body>
</html>`;
}

export function unsubscribeConfirmationTemplate(): string {
  return `
<!DOCTYPE html>
<html>
<head><style>${baseStyles}</style></head>
<body>
  <div class="container">
    <div class="header">
      <h1>${siteName}</h1>
    </div>
    <div class="content">
      <h2>You've Been Unsubscribed</h2>
      <p>You've been successfully removed from the Morning Briefing mailing list. We're sorry to see you go!</p>
      <p>If you unsubscribed by mistake, you can always resubscribe on our website.</p>
      <p style="text-align: center;">
        <a href="${siteUrl}" class="button">Visit Our Website</a>
      </p>
    </div>
    <div class="footer">
      <p>${siteName}<br>Bellingham, WA</p>
    </div>
  </div>
</body>
</html>`;
}
