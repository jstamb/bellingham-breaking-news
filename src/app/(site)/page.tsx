import prisma from '@/lib/prisma';
import ArticleCard from '@/components/news/ArticleCard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  featuredImage: string | null;
  imageAlt: string | null;
  category: string;
  author: string;
  isBreaking: boolean;
  publishedAt: Date;
};

async function getLatestPosts(limit: number = 10): Promise<Post[]> {
  try {
    return await prisma.post.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
      take: limit,
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
  } catch {
    return [];
  }
}

async function getCategoryPosts(category: string, limit: number = 4): Promise<Post[]> {
  try {
    return await prisma.post.findMany({
      where: {
        isPublished: true,
        category: { equals: category, mode: 'insensitive' },
      },
      orderBy: { publishedAt: 'desc' },
      take: limit,
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
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [latestPosts, localPosts, politicsPosts] = await Promise.all([
    getLatestPosts(10),
    getCategoryPosts('Local', 4),
    getCategoryPosts('Politics', 4),
  ]);

  const heroPosts = latestPosts.slice(0, 5);
  const recentPosts = latestPosts.slice(5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      {heroPosts.length > 0 && (
        <section className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Main featured article */}
            <div className="lg:col-span-2">
              <ArticleCard
                post={heroPosts[0]}
                variant="overlay"
                priority
              />
            </div>

            {/* Side featured articles */}
            <div className="grid grid-cols-1 gap-4">
              {heroPosts.slice(1, 3).map((post, index) => (
                <ArticleCard
                  key={post.slug}
                  post={post}
                  variant="overlay"
                  priority={index === 0}
                />
              ))}
            </div>
          </div>

          {/* Bottom row */}
          {heroPosts.length > 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {heroPosts.slice(3, 5).map((post) => (
                <ArticleCard
                  key={post.slug}
                  post={post}
                  variant="horizontal"
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Recent News Section */}
      {recentPosts.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-headline text-2xl font-bold text-gray-900 dark:text-white">
              Recent News
            </h2>
            <Link
              href="/news"
              className="text-cat-business hover:underline text-sm font-medium"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <ArticleCard key={post.slug} post={post} variant="vertical" />
            ))}
          </div>
        </section>
      )}

      {/* Category Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Local News */}
        {localPosts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline text-2xl font-bold text-gray-900 dark:text-white">
                Local News
              </h2>
              <Link
                href="/category/local"
                className="text-cat-local hover:underline text-sm font-medium"
              >
                More Local
              </Link>
            </div>
            <div className="space-y-2">
              {localPosts.map((post) => (
                <ArticleCard key={post.slug} post={post} variant="horizontal" />
              ))}
            </div>
          </section>
        )}

        {/* Politics */}
        {politicsPosts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline text-2xl font-bold text-gray-900 dark:text-white">
                Politics
              </h2>
              <Link
                href="/category/politics"
                className="text-cat-politics hover:underline text-sm font-medium"
              >
                More Politics
              </Link>
            </div>
            <div className="space-y-2">
              {politicsPosts.map((post) => (
                <ArticleCard key={post.slug} post={post} variant="horizontal" />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
