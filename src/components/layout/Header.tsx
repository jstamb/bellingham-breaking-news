'use client';

import Link from 'next/link';
import { Menu, X, Search } from 'lucide-react';
import { useState } from 'react';

const categories = [
  { name: 'Front Page', href: '/' },
  { name: 'Fairhaven', href: '/category/fairhaven' },
  { name: 'WWU Campus', href: '/category/wwu' },
  { name: 'Waterfront', href: '/category/waterfront' },
  { name: 'Whatcom Falls', href: '/category/whatcom-falls' },
  { name: 'Business', href: '/category/business' },
  { name: 'Police & Fire', href: '/category/police-fire' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      {/* Top Utility Bar */}
      <div className="bg-secondary text-white py-1.5 px-4 md:px-10 flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em]">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
            Live Updates
          </span>
          <span className="hidden sm:inline opacity-40">Whatcom County Edition</span>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-primary transition-colors">Sign In</a>
          <a href="#" className="hover:text-primary transition-colors">Digital Edition</a>
        </div>
      </div>

      {/* Branding Area */}
      <div className="py-6 md:py-10 px-4 md:px-10 flex flex-col lg:flex-row justify-between items-center bg-white">
        <div className="text-center lg:text-left mb-4 lg:mb-0">
          <Link href="/" className="block">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-secondary tracking-tighter font-headline leading-none">
              BELLINGHAM<br />
              <span className="text-primary italic">BREAKING</span> NEWS
            </h1>
          </Link>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden xl:block text-right border-r border-gray-100 pr-6 mr-6">
            <p className="text-[10px] font-black text-secondary uppercase opacity-40 tracking-widest">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p className="text-sm font-bold text-secondary">Bellingham, WA</p>
          </div>
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="flex items-center gap-2 text-[11px] font-black uppercase border-2 border-gray-100 hover:border-primary px-6 md:px-8 py-3 md:py-3.5 transition-all tracking-widest group"
          >
            <Search className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Search</span>
          </button>
          <Link
            href="/support"
            className="bg-primary hover:bg-secondary px-6 md:px-10 py-3 md:py-4 text-white font-black uppercase text-[11px] transition-all shadow-xl shadow-primary/20 tracking-[0.1em]"
          >
            Support Local
          </Link>
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-secondary" />
            ) : (
              <Menu className="w-6 h-6 text-secondary" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-white px-4 md:px-10 border-t border-gray-100 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <ul className="hidden lg:flex items-center justify-start gap-8 xl:gap-12 font-condensed font-black uppercase text-[12px] xl:text-[13px] tracking-[0.2em] xl:tracking-[0.25em] h-14 xl:h-16">
          {categories.map((cat, index) => (
            <li key={cat.name}>
              <Link
                href={cat.href}
                className={`h-full flex items-center transition-colors cursor-pointer ${
                  index === 0
                    ? 'text-primary border-b-4 border-primary'
                    : 'text-secondary/60 hover:text-primary'
                }`}
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="lg:hidden bg-white border-t border-gray-100 px-4 py-4">
          <div className="flex flex-col space-y-1">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="px-4 py-3 text-sm font-black uppercase tracking-widest text-secondary hover:bg-lightGray hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </nav>
      )}

      {/* Search Modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 bg-secondary/95 backdrop-blur-md z-[2000] flex items-center justify-center p-4"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="bg-white w-full max-w-2xl rounded shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-headline text-xl font-black text-secondary uppercase tracking-tighter">News Archive Search</h3>
              <button onClick={() => setSearchOpen(false)} className="text-gray-400 hover:text-primary transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8">
              <form action="/search" method="get">
                <input
                  autoFocus
                  type="text"
                  name="q"
                  placeholder="Type to search..."
                  className="w-full text-xl border-b-2 border-primary outline-none py-4 mb-6 font-serif italic"
                />
                <button
                  type="submit"
                  className="bg-primary text-white px-8 py-3 font-black uppercase text-xs tracking-widest hover:bg-secondary transition"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </header>
  );
}
