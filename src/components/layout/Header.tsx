'use client';

import Link from 'next/link';
import { Menu, X, Search } from 'lucide-react';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

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

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-headline text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              Bellingham Breaking News
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-cat-politics dark:hover:text-cat-politics transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            <button
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <ThemeToggle />
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col space-y-2">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
