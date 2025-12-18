import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

interface BreakingPost {
  slug: string;
  title: string;
}

interface BreakingNewsBannerProps {
  post: BreakingPost;
}

export default function BreakingNewsBanner({ post }: BreakingNewsBannerProps) {
  return (
    <div className="bg-red-600 text-white py-2 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href={`/news/${post.slug}`}
          className="flex items-center gap-3 group"
        >
          <span className="flex items-center gap-2 flex-shrink-0 animate-pulse">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-bold text-sm uppercase tracking-wide">
              Breaking
            </span>
          </span>
          <span className="border-l border-red-400 h-4" />
          <span className="text-sm font-medium truncate group-hover:underline">
            {post.title}
          </span>
        </Link>
      </div>
    </div>
  );
}
