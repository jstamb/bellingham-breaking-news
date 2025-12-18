import Image from 'next/image';
import Link from 'next/link';
import { formatDate, getCategoryColor, blurDataURL } from '@/lib/utils';

interface Post {
  title: string;
  content: string;
  excerpt: string;
  featuredImage?: string | null;
  imageAlt?: string | null;
  category: string;
  tags: string[];
  author: string;
  publishedAt: Date | string;
  updatedAt: Date | string;
}

interface ArticleContentProps {
  post: Post;
}

function formatContent(content: string): string {
  // Check if content already has HTML paragraph tags
  if (content.includes('<p>') || content.includes('<p ')) {
    return content;
  }

  // Convert \n\n (double newlines) to paragraph breaks
  // and single \n to <br> tags
  const paragraphs = content
    .split(/\n\s*\n/) // Split on double newlines (with optional whitespace)
    .map(para => para.trim())
    .filter(para => para.length > 0)
    .map(para => {
      // Convert single newlines within paragraph to <br>
      const withBreaks = para.replace(/\n/g, '<br>');
      return `<p>${withBreaks}</p>`;
    });

  return paragraphs.join('\n');
}

export default function ArticleContent({ post }: ArticleContentProps) {
  const imageUrl = post.featuredImage || `https://picsum.photos/seed/${post.title}/1200/800`;
  const formattedContent = formatContent(post.content);

  return (
    <article className="max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Link
            href={`/category/${post.category.toLowerCase()}`}
            className={`px-3 py-1 text-sm font-semibold text-white rounded ${getCategoryColor(post.category)}`}
          >
            {post.category}
          </Link>
        </div>
        <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {post.title}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
          {post.excerpt}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span>By {post.author}</span>
          <span>&middot;</span>
          <time dateTime={new Date(post.publishedAt).toISOString()}>
            {formatDate(post.publishedAt)}
          </time>
        </div>
      </header>

      {/* Featured Image */}
      <div className="relative aspect-[16/9] mb-8 rounded-lg overflow-hidden">
        <Image
          src={imageUrl}
          alt={post.imageAlt || post.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          placeholder="blur"
          blurDataURL={blurDataURL}
          priority
        />
      </div>

      {/* Content */}
      <div
        className="prose prose-lg dark:prose-invert prose-headings:font-headline prose-a:text-cat-business max-w-none"
        dangerouslySetInnerHTML={{ __html: formattedContent }}
      />

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
