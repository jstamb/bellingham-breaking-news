import ArticleCard from './ArticleCard';

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  featuredImage?: string | null;
  imageAlt?: string | null;
  category: string;
  author: string;
  isBreaking: boolean;
  publishedAt: Date | string;
}

interface RelatedArticlesProps {
  posts: Post[];
  title?: string;
}

export default function RelatedArticles({
  posts,
  title = 'Related Articles',
}: RelatedArticlesProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
      <h2 className="font-headline text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <ArticleCard key={post.slug} post={post} variant="vertical" />
        ))}
      </div>
    </section>
  );
}
