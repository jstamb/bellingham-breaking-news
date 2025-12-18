import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BreakingNewsBanner from '@/components/news/BreakingNewsBanner';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getBreakingNews() {
  try {
    const breaking = await prisma.post.findFirst({
      where: {
        isPublished: true,
        isBreaking: true,
      },
      orderBy: { publishedAt: 'desc' },
      select: {
        slug: true,
        title: true,
      },
    });
    return breaking;
  } catch {
    // Database not available during build
    return null;
  }
}

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breakingNews = await getBreakingNews();

  return (
    <div className="min-h-screen flex flex-col">
      {breakingNews && <BreakingNewsBanner post={breakingNews} />}
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
