import Image from 'next/image';
import Link from 'next/link';
import { cn, formatRelativeTime, getCategoryColor, blurDataURL } from '@/lib/utils';

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

interface ArticleCardProps {
  post: Post;
  variant?: 'vertical' | 'horizontal' | 'overlay' | 'compact';
  priority?: boolean;
}

export default function ArticleCard({
  post,
  variant = 'vertical',
  priority = false,
}: ArticleCardProps) {
  const imageUrl = post.featuredImage || `https://picsum.photos/seed/${post.slug}/800/600`;

  if (variant === 'overlay') {
    return (
      <Link href={`/news/${post.slug}`} className="group relative block h-full">
        <div className="relative h-full min-h-[300px] overflow-hidden rounded-lg">
          <Image
            src={imageUrl}
            alt={post.imageAlt || post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL={blurDataURL}
            priority={priority}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={cn(
                  'px-2 py-1 text-xs font-semibold text-white rounded',
                  getCategoryColor(post.category)
                )}
              >
                {post.category}
              </span>
              {post.isBreaking && (
                <span className="px-2 py-1 text-xs font-semibold text-white bg-red-600 rounded animate-pulse">
                  BREAKING
                </span>
              )}
            </div>
            <h3 className="font-headline text-lg md:text-xl lg:text-2xl font-bold text-white mb-2 line-clamp-3 group-hover:underline">
              {post.title}
            </h3>
            <p className="text-gray-300 text-sm line-clamp-2 hidden md:block">
              {post.excerpt}
            </p>
            <div className="mt-2 text-gray-400 text-xs">
              {formatRelativeTime(post.publishedAt)}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'horizontal') {
    return (
      <Link
        href={`/news/${post.slug}`}
        className="group flex gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <div className="relative w-32 h-24 md:w-48 md:h-32 flex-shrink-0 overflow-hidden rounded-lg">
          <Image
            src={imageUrl}
            alt={post.imageAlt || post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 128px, 192px"
            placeholder="blur"
            blurDataURL={blurDataURL}
            priority={priority}
          />
        </div>
        <div className="flex flex-col justify-center flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={cn(
                'px-2 py-0.5 text-xs font-semibold text-white rounded',
                getCategoryColor(post.category)
              )}
            >
              {post.category}
            </span>
            {post.isBreaking && (
              <span className="px-2 py-0.5 text-xs font-semibold text-white bg-red-600 rounded animate-pulse">
                BREAKING
              </span>
            )}
          </div>
          <h3 className="font-headline text-base md:text-lg font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-cat-politics transition-colors">
            {post.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mt-1 hidden md:block">
            {post.excerpt}
          </p>
          <div className="mt-1 text-gray-500 dark:text-gray-500 text-xs">
            {formatRelativeTime(post.publishedAt)}
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link
        href={`/news/${post.slug}`}
        className="group flex gap-3 py-3 border-b border-gray-200 dark:border-gray-800 last:border-0"
      >
        <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded">
          <Image
            src={imageUrl}
            alt={post.imageAlt || post.title}
            fill
            className="object-cover"
            sizes="64px"
            placeholder="blur"
            blurDataURL={blurDataURL}
          />
        </div>
        <div className="flex flex-col justify-center flex-1 min-w-0">
          <h4 className="font-medium text-sm text-gray-900 dark:text-white line-clamp-2 group-hover:text-cat-politics transition-colors">
            {post.title}
          </h4>
          <span className="text-gray-500 text-xs mt-1">
            {formatRelativeTime(post.publishedAt)}
          </span>
        </div>
      </Link>
    );
  }

  // Default: vertical variant
  return (
    <Link href={`/news/${post.slug}`} className="group block">
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg mb-3">
        <Image
          src={imageUrl}
          alt={post.imageAlt || post.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          placeholder="blur"
          blurDataURL={blurDataURL}
          priority={priority}
        />
      </div>
      <div className="flex items-center gap-2 mb-2">
        <span
          className={cn(
            'px-2 py-0.5 text-xs font-semibold text-white rounded',
            getCategoryColor(post.category)
          )}
        >
          {post.category}
        </span>
        {post.isBreaking && (
          <span className="px-2 py-0.5 text-xs font-semibold text-white bg-red-600 rounded animate-pulse">
            BREAKING
          </span>
        )}
      </div>
      <h3 className="font-headline text-lg font-bold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-cat-politics transition-colors">
        {post.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
        {post.excerpt}
      </p>
      <div className="mt-2 text-gray-500 text-xs">
        {formatRelativeTime(post.publishedAt)}
      </div>
    </Link>
  );
}
