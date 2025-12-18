import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

interface SearchPageProps {
  searchParams: { q?: string };
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const query = searchParams.q || '';
  return {
    title: query ? `Search: ${query}` : 'Search',
    description: `Search results for "${query}" on Bellingham Breaking News`,
  };
}

async function searchPosts(query: string) {
  if (!query || query.trim().length === 0) {
    return [];
  }

  try {
    return await prisma.post.findMany({
      where: {
        isPublished: true,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { excerpt: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
          { category: { contains: query, mode: 'insensitive' } },
          { author: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: { publishedAt: 'desc' },
      take: 50,
      select: {
        slug: true,
        title: true,
        excerpt: true,
        featuredImage: true,
        imageAlt: true,
        category: true,
        author: true,
        publishedAt: true,
      },
    });
  } catch {
    return [];
  }
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';
  const results = await searchPosts(query);

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-16">
      <header className="mb-12">
        <h1 className="font-headline text-3xl md:text-4xl font-bold text-secondary mb-4">
          Search Results
        </h1>
        {query ? (
          <p className="text-gray-600">
            {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
          </p>
        ) : (
          <p className="text-gray-600">Enter a search term to find articles.</p>
        )}
      </header>

      {/* Search Form */}
      <form action="/search" method="get" className="mb-12">
        <div className="flex gap-4 max-w-2xl">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search articles..."
            className="flex-1 p-4 border-2 border-gray-200 focus:border-primary outline-none text-lg"
          />
          <button
            type="submit"
            className="bg-primary text-white px-8 py-4 font-black uppercase text-xs tracking-widest hover:bg-secondary transition"
          >
            Search
          </button>
        </div>
      </form>

      {/* Results */}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map(post => (
            <Link
              key={post.slug}
              href={`/news/${post.slug}`}
              className="group cursor-pointer flex flex-col border-b border-gray-100 pb-8"
            >
              <div className="relative aspect-video overflow-hidden mb-6 rounded-sm shadow-md">
                {post.featuredImage ? (
                  <Image
                    src={post.featuredImage}
                    alt={post.imageAlt || post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
              </div>
              <span className="text-primary text-[11px] font-black uppercase tracking-[0.3em] mb-3 block">
                {post.category}
              </span>
              <h3 className="text-xl font-bold font-headline leading-tight group-hover:text-primary transition-colors mb-3">
                {post.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2 font-serif italic">
                {post.excerpt}
              </p>
              <div className="mt-auto flex items-center justify-between text-[10px] font-black uppercase text-gray-400 tracking-widest">
                <span>By {post.author}</span>
                <span>{formatDate(post.publishedAt)}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : query ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg mb-4">No articles found matching your search.</p>
          <p className="text-gray-400">Try different keywords or browse our categories.</p>
        </div>
      ) : null}
    </div>
  );
}
