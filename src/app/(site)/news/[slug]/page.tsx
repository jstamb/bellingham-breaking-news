import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import ArticleContent from '@/components/news/ArticleContent';
import RelatedArticles from '@/components/news/RelatedArticles';
import ArticleSchema from '@/components/seo/ArticleSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: { slug: string };
}

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug },
  });
  return post;
}

async function getRelatedPosts(category: string, excludeSlug: string) {
  return prisma.post.findMany({
    where: {
      isPublished: true,
      category: { equals: category, mode: 'insensitive' },
      slug: { not: excludeSlug },
    },
    orderBy: { publishedAt: 'desc' },
    take: 3,
    select: {
      slug: true,
      title: true,
      excerpt: true,
      featuredImage: true,
      imageAlt: true,
      category: true,
      author: true,
      isBreaking: true,
      publishedAt: true,
    },
  });
}

async function incrementViewCount(slug: string) {
  try {
    await prisma.post.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
    });
  } catch {
    // Silently ignore view count errors
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getPost(params.slug);

  if (!post) {
    return {
      title: 'Article Not Found',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bellinghambreakingnews.com';
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Bellingham Breaking News';

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.author],
      section: post.category,
      images: post.featuredImage
        ? [
            {
              url: post.featuredImage,
              width: 1200,
              height: 630,
              alt: post.imageAlt || post.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      images: post.featuredImage ? [post.featuredImage] : undefined,
    },
    alternates: {
      canonical: post.canonicalUrl || `${siteUrl}/news/${post.slug}`,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const post = await getPost(params.slug);

  if (!post || !post.isPublished) {
    notFound();
  }

  // Fire-and-forget view count increment
  incrementViewCount(params.slug);

  const relatedPosts = await getRelatedPosts(post.category, post.slug);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bellinghambreakingnews.com';
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Bellingham Breaking News';
  const articleUrl = `${siteUrl}/news/${post.slug}`;

  return (
    <>
      <ArticleSchema
        title={post.title}
        description={post.excerpt}
        image={post.featuredImage || undefined}
        datePublished={post.publishedAt.toISOString()}
        dateModified={post.updatedAt.toISOString()}
        author={post.author}
        url={articleUrl}
        category={post.category}
        tags={post.tags}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: siteUrl },
          { name: 'News', url: `${siteUrl}/news` },
          { name: post.category, url: `${siteUrl}/category/${post.category.toLowerCase()}` },
          { name: post.title, url: articleUrl },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ArticleContent post={post} />
        <RelatedArticles posts={relatedPosts} />
      </div>
    </>
  );
}
