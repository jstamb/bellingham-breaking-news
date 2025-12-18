import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import ArticleCard from '@/components/news/ArticleCard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'All News',
  description: 'Browse all the latest news from Bellingham and Whatcom County.',
};

async function getAllPosts() {
  return prisma.post.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' },
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

export default async function NewsPage() {
  const posts = await getAllPosts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <h1 className="font-headline text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          All News
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {posts.length} article{posts.length !== 1 ? 's' : ''} published
        </p>
      </header>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <ArticleCard
              key={post.slug}
              post={post}
              variant="vertical"
              priority={index < 3}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            No articles published yet. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
}
