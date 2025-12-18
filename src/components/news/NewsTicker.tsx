import Link from 'next/link';
import prisma from '@/lib/prisma';

async function getHeadlines() {
  try {
    const posts = await prisma.post.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
      take: 10,
      select: {
        slug: true,
        title: true,
      },
    });
    return posts;
  } catch {
    return [];
  }
}

export default async function NewsTicker() {
  const headlines = await getHeadlines();

  if (headlines.length === 0) {
    return null;
  }

  return (
    <div className="bg-lightGray border-b border-gray-200 py-3 px-4 md:px-10 flex items-center gap-6">
      <span className="bg-primary text-white text-[10px] font-black uppercase px-3 py-1 rounded shadow-sm flex-shrink-0 tracking-widest">
        Flash News
      </span>
      <div className="overflow-hidden flex-1 relative h-5">
        <div className="absolute whitespace-nowrap animate-scroll flex items-center gap-8">
          {/* First set of headlines */}
          {headlines.map((post) => (
            <Link
              key={post.slug}
              href={`/news/${post.slug}`}
              className="text-[12px] font-bold text-secondary uppercase tracking-tight opacity-80 hover:opacity-100 hover:text-primary transition-colors inline-flex items-center gap-2"
            >
              <span className="text-primary">&bull;</span>
              {post.title}
            </Link>
          ))}
          {/* Duplicate for seamless loop */}
          {headlines.map((post) => (
            <Link
              key={`dup-${post.slug}`}
              href={`/news/${post.slug}`}
              className="text-[12px] font-bold text-secondary uppercase tracking-tight opacity-80 hover:opacity-100 hover:text-primary transition-colors inline-flex items-center gap-2"
            >
              <span className="text-primary">&bull;</span>
              {post.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
