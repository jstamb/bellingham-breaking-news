import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Bellingham Breaking News, your trusted source for local news and community coverage.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-8">
        <h1 className="font-headline text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          About Bellingham Breaking News
        </h1>
      </header>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p>
          Bellingham Breaking News is your trusted source for timely, accurate news
          coverage of Bellingham and Whatcom County. We are committed to keeping our
          community informed about the events, issues, and stories that matter most.
        </p>

        <h2>Our Mission</h2>
        <p>
          Our mission is to provide comprehensive, unbiased news coverage that empowers
          residents to stay informed and engaged with their community. We believe that
          access to reliable local news is essential for a healthy democracy and a
          thriving community.
        </p>

        <h2>What We Cover</h2>
        <p>
          From breaking news and local politics to business developments, sports, and
          cultural events, we cover the full spectrum of stories that impact life in
          Bellingham and the surrounding area. Our coverage includes:
        </p>
        <ul>
          <li>Local government and politics</li>
          <li>Business and economic development</li>
          <li>Community events and cultural happenings</li>
          <li>Sports and recreation</li>
          <li>Weather and environmental news</li>
          <li>Breaking news and emergency updates</li>
        </ul>

        <h2>Contact Us</h2>
        <p>
          Have a news tip or story idea? We want to hear from you. Reach out to us at{' '}
          <a href="mailto:news@bellinghambreakingnews.com">
            news@bellinghambreakingnews.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
