import Link from 'next/link';

interface TrendingArticle {
  slug: string;
  title: string;
  category: string;
}

interface TrendingSidebarProps {
  articles: TrendingArticle[];
}

export default function TrendingSidebar({ articles }: TrendingSidebarProps) {
  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-2">
      <h4 className="text-secondary font-black uppercase text-xs tracking-widest border-b-2 border-gray-100 pb-4 mb-10">
        Top Trending in Bellingham
      </h4>
      <div className="space-y-10">
        {articles.slice(0, 5).map((article, idx) => (
          <Link
            key={article.slug}
            href={`/news/${article.slug}`}
            className="flex gap-6 group cursor-pointer"
          >
            <div className="text-4xl font-black text-gray-100 group-hover:text-primary/20 transition-colors leading-none font-serif">
              {String(idx + 1).padStart(2, '0')}
            </div>
            <div className="flex-1">
              <h5 className="text-sm font-bold leading-tight font-headline group-hover:text-primary transition-colors line-clamp-2">
                {article.title}
              </h5>
              <span className="text-[9px] font-black text-gray-400 uppercase mt-2 block tracking-widest">
                {article.category}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
