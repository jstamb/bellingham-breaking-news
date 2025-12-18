import Link from 'next/link';
import NewsletterForm from '../newsletter/NewsletterForm';

const categories = [
  { name: 'Local', href: '/category/local' },
  { name: 'Politics', href: '/category/politics' },
  { name: 'Police & Fire', href: '/category/police-fire' },
  { name: 'Business', href: '/category/business' },
  { name: 'WWU', href: '/category/wwu' },
  { name: 'Sports', href: '/category/sports' },
  { name: 'Restaurants', href: '/category/restaurants' },
  { name: 'Waterfront', href: '/category/waterfront' },
  { name: 'Weather', href: '/category/weather' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 mb-4 md:mb-0">
              <h3 className="font-headline text-xl font-bold mb-2">
                Morning Briefing
              </h3>
              <p className="text-gray-400 text-sm">
                Start your day with the top Bellingham news delivered to your inbox.
              </p>
            </div>
            <div className="md:w-1/2 md:max-w-md">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h2 className="font-headline text-2xl font-bold mb-4">
              Bellingham Breaking News
            </h2>
            <p className="text-gray-400 mb-4 max-w-md">
              Your trusted source for breaking news, local updates, and in-depth
              coverage of Bellingham and Whatcom County. Stay informed with the
              stories that matter most to our community.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-headline text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link
                    href={category.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-headline text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/news"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  All News
                </Link>
              </li>
              <li>
                <a
                  href="mailto:news@bellinghambreakingnews.com"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {currentYear} Bellingham Breaking News. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
