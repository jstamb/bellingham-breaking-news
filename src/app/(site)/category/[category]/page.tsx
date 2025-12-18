import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import ArticleCard from '@/components/news/ArticleCard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: { category: string };
}

async function getCategoryPosts(category: string) {
  try {
    return await prisma.post.findMany({
      where: {
        isPublished: true,
        category: { equals: category, mode: 'insensitive' },
      },
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
  } catch {
    return [];
  }
}

function formatCategoryName(category: string): string {
  // Handle special cases like "police-fire"
  if (category.toLowerCase() === 'police-fire') {
    return 'Police & Fire';
  }
  return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const categoryName = formatCategoryName(params.category);

  return {
    title: `${categoryName} News`,
    description: `Latest ${categoryName.toLowerCase()} news from Bellingham and Whatcom County.`,
    openGraph: {
      title: `${categoryName} News | Bellingham Breaking News`,
      description: `Latest ${categoryName.toLowerCase()} news from Bellingham and Whatcom County.`,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const posts = await getCategoryPosts(params.category);
  const categoryName = formatCategoryName(params.category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <h1 className="font-headline text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {categoryName} News
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {posts.length} article{posts.length !== 1 ? 's' : ''} in this category
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
            No articles in this category yet. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
}
