import prisma from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import NewsTicker from '@/components/news/NewsTicker';
import WeatherWidget from '@/components/sidebar/WeatherWidget';
import NewsletterWidget from '@/components/sidebar/NewsletterWidget';
import TrendingSidebar from '@/components/sidebar/TrendingSidebar';
import TipSubmit from '@/components/sidebar/TipSubmit';

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

async function getLatestPosts(limit: number = 12): Promise<Post[]> {
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

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function HomePage() {
  const posts = await getLatestPosts(12);

  const featured = posts[0];
  const gridPosts = posts.slice(1, 7);
  const trendingPosts = posts.slice(0, 5).map(p => ({
    slug: p.slug,
    title: p.title,
    category: p.category,
  }));

  return (
    <>
      {/* News Ticker */}
      <NewsTicker />

      <main className="max-w-[1440px] mx-auto px-4 md:px-10 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Feed Content */}
          <div className="lg:col-span-8">
            {/* Featured Article */}
            {featured && (
              <section className="mb-20">
                <Link
                  href={`/news/${featured.slug}`}
                  className="relative block group cursor-pointer overflow-hidden rounded-sm shadow-2xl mb-12"
                >
                  <div className="relative aspect-[21/9]">
                    {featured.featuredImage ? (
                      <Image
                        src={featured.featuredImage}
                        alt={featured.imageAlt || featured.title}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent"></div>
                  </div>
                  <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white w-full">
                    <span className="bg-primary text-white text-[11px] font-black uppercase px-4 py-1.5 mb-6 inline-block tracking-[0.3em] shadow-lg">
                      {featured.isBreaking ? 'Breaking' : 'Lead Report'}
                    </span>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold font-headline leading-[1.05] mb-8 group-hover:text-primary transition-colors">
                      {featured.title}
                    </h2>
                    <div className="flex items-center text-[11px] uppercase font-black tracking-[0.2em] gap-8 opacity-60">
                      <span className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-primary rounded-full"></div>
                        {featured.author}
                      </span>
                      <span>{formatDate(featured.publishedAt)}</span>
                    </div>
                  </div>
                </Link>
              </section>
            )}

            {/* Grid Articles */}
            {gridPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                {gridPosts.map(post => (
                  <Link
                    key={post.slug}
                    href={`/news/${post.slug}`}
                    className="group cursor-pointer flex flex-col border-b border-gray-100 pb-12 last:border-0"
                  >
                    <div className="relative aspect-video overflow-hidden mb-8 rounded-sm shadow-md">
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
                      {post.isBreaking && (
                        <span className="absolute top-4 left-4 bg-secondary text-white text-[9px] font-black px-3 py-1 tracking-widest uppercase">
                          Breaking
                        </span>
                      )}
                    </div>
                    <span className="text-primary text-[11px] font-black uppercase tracking-[0.3em] mb-4 block">
                      {post.category}
                    </span>
                    <h3 className="text-2xl font-bold font-headline leading-tight group-hover:text-primary transition-colors mb-5">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-3 font-serif italic">
                      {post.excerpt}
                    </p>
                    <div className="mt-auto flex items-center justify-between text-[10px] font-black uppercase text-gray-400 tracking-widest">
                      <span className="hover:text-secondary">By {post.author}</span>
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Load More Button */}
            {posts.length >= 7 && (
              <div className="mt-20 text-center">
                <Link
                  href="/news"
                  className="inline-block bg-secondary text-white px-16 py-5 font-black uppercase text-xs tracking-[0.3em] hover:bg-primary transition shadow-2xl"
                >
                  Load More Stories
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-16">
            <WeatherWidget />
            <NewsletterWidget />
            <TrendingSidebar articles={trendingPosts} />
            <TipSubmit />
          </aside>
        </div>
      </main>
    </>
  );
}
