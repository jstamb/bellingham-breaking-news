interface ArticleSchemaProps {
  title: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified: string;
  author: string;
  url: string;
  category?: string;
  tags?: string[];
}

export default function ArticleSchema({
  title,
  description,
  image,
  datePublished,
  dateModified,
  author,
  url,
  category,
  tags,
}: ArticleSchemaProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bellinghambreakingnews.com';
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Bellingham Breaking News';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    description: description,
    image: image ? [image] : [`${siteUrl}/og-image.png`],
    datePublished: datePublished,
    dateModified: dateModified,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    ...(category && { articleSection: category }),
    ...(tags && tags.length > 0 && { keywords: tags.join(', ') }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
