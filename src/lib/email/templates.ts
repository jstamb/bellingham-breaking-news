const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bellinghambreakingnews.com';
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Bellingham Breaking News';

const brandBlue = '#003f87';
const brandBlueLight = '#e8f0f8';

const baseStyles = `
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
  .wrapper { background-color: #f4f4f4; padding: 20px 0; }
  .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
  .header { background: linear-gradient(135deg, ${brandBlue} 0%, #002855 100%); color: white; padding: 30px 20px; text-align: center; }
  .header h1 { margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; }
  .header-subtitle { margin: 8px 0 0 0; font-size: 14px; opacity: 0.9; font-weight: 400; }
  .content { padding: 30px 25px; background: #ffffff; }
  .footer { background: #f8f9fa; padding: 25px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #eee; }
  .footer a { color: ${brandBlue}; }
  .button { display: inline-block; background: ${brandBlue}; color: white !important; padding: 14px 28px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: 600; }
  .article { border-left: 3px solid ${brandBlue}; padding: 15px 0 15px 15px; margin: 15px 0; background: #fafafa; border-radius: 0 6px 6px 0; }
  .article h3 { margin: 0 0 8px 0; font-size: 16px; }
  .article h3 a { color: #222; text-decoration: none; }
  .article h3 a:hover { color: ${brandBlue}; }
  .article p { margin: 0; color: #555; font-size: 14px; line-height: 1.5; }
  .category { display: inline-block; background: ${brandBlueLight}; color: ${brandBlue}; padding: 3px 10px; border-radius: 12px; font-size: 11px; text-transform: uppercase; font-weight: 600; margin-bottom: 8px; }
  .divider { height: 1px; background: #eee; margin: 25px 0; }
  .greeting { font-size: 22px; color: #222; margin: 0 0 10px 0; font-weight: 600; }
  .intro { color: #555; margin: 0 0 20px 0; }
  .date-badge { display: inline-block; background: ${brandBlueLight}; color: ${brandBlue}; padding: 6px 12px; border-radius: 4px; font-size: 13px; font-weight: 500; margin-bottom: 15px; }
`;

export function welcomeEmailTemplate(verifyUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${baseStyles}</style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>${siteName}</h1>
        <p class="header-subtitle">Weekly Briefing</p>
      </div>
      <div class="content">
        <h2 class="greeting">Welcome to the Weekly Briefing!</h2>
        <p class="intro">Thank you for subscribing to the ${siteName} Weekly Briefing. Every Friday morning, we'll deliver a roundup of the week's most important Bellingham and Whatcom County news straight to your inbox.</p>
        <p>Please confirm your email address to start receiving updates:</p>
        <p style="text-align: center;">
          <a href="${verifyUrl}" class="button">Confirm Email Address</a>
        </p>
        <div class="divider"></div>
        <p style="font-size: 13px; color: #888;">If you didn't subscribe to this newsletter, you can safely ignore this email.</p>
      </div>
      <div class="footer">
        <p><strong>${siteName}</strong><br>Your trusted source for Bellingham news</p>
        <p><a href="${siteUrl}">Visit our website</a></p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export function verificationConfirmedTemplate(): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${baseStyles}</style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>${siteName}</h1>
        <p class="header-subtitle">Weekly Briefing</p>
      </div>
      <div class="content">
        <h2 class="greeting">You're All Set!</h2>
        <p class="intro">Your email has been confirmed. You'll now receive our Weekly Briefing every Friday morning at 7am Pacific.</p>
        <p>Here's what you can expect:</p>
        <ul style="color: #555; padding-left: 20px;">
          <li style="margin-bottom: 8px;">Weekly roundup of the top Bellingham & Whatcom County stories</li>
          <li style="margin-bottom: 8px;">Coverage across local news, politics, business, sports & more</li>
          <li style="margin-bottom: 8px;">Direct links to full articles on our website</li>
        </ul>
        <p style="text-align: center;">
          <a href="${siteUrl}" class="button">Read Latest News</a>
        </p>
      </div>
      <div class="footer">
        <p><strong>${siteName}</strong><br>Your trusted source for Bellingham news</p>
      </div>
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
  isBreaking?: boolean;
}

export function weeklyBriefingTemplate(
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
      <h3><a href="${article.url}">${article.title}</a></h3>
      <p>${article.excerpt}</p>
    </div>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${baseStyles}</style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>${siteName}</h1>
        <p class="header-subtitle">Weekly Briefing</p>
      </div>
      <div class="content">
        <span class="date-badge">${today}</span>
        <h2 class="greeting">Good morning, Bellingham!</h2>
        <p class="intro">Here's your weekly roundup of the top stories from Bellingham and Whatcom County. Catch up on everything you might have missed.</p>

        ${articleHtml}

        <div class="divider"></div>

        <p style="text-align: center;">
          <a href="${siteUrl}" class="button">Read More Stories</a>
        </p>

        <p style="text-align: center; font-size: 13px; color: #888; margin-top: 20px;">
          Thanks for reading! See you next Friday.
        </p>
      </div>
      <div class="footer">
        <p><strong>${siteName}</strong><br>Your trusted source for Bellingham news</p>
        <p style="margin-top: 15px;"><a href="${unsubscribeUrl}">Unsubscribe</a> from the Weekly Briefing</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

// Keep old function name for backwards compatibility
export const morningBriefingTemplate = weeklyBriefingTemplate;

export function unsubscribeConfirmationTemplate(): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${baseStyles}</style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>${siteName}</h1>
        <p class="header-subtitle">Weekly Briefing</p>
      </div>
      <div class="content">
        <h2 class="greeting">You've Been Unsubscribed</h2>
        <p class="intro">You've been successfully removed from the Weekly Briefing mailing list. We're sorry to see you go!</p>
        <p>If you unsubscribed by mistake, you can always resubscribe on our website.</p>
        <p style="text-align: center;">
          <a href="${siteUrl}" class="button">Visit Our Website</a>
        </p>
      </div>
      <div class="footer">
        <p><strong>${siteName}</strong><br>Your trusted source for Bellingham news</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}
