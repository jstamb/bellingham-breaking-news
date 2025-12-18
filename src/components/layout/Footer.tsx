'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Loader2, CheckCircle } from 'lucide-react';

const categories = [
  { name: 'Local News', href: '/category/local' },
  { name: 'WWU Campus', href: '/category/wwu' },
  { name: 'Politics', href: '/category/politics' },
  { name: 'Business', href: '/category/business' },
  { name: 'Restaurants', href: '/category/restaurants' },
];

const moreCategories = [
  { name: 'Sports', href: '/category/sports' },
  { name: 'Weather', href: '/category/weather' },
  { name: 'Waterfront', href: '/category/waterfront' },
  { name: 'Police & Fire', href: '/category/police-fire' },
  { name: 'All News', href: '/news' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const currentYear = new Date().getFullYear();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <footer className="bg-secondary text-white pt-32 pb-16 mt-32 border-t-8 border-primary">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          {/* Brand Section */}
          <div className="space-y-10">
            <Link href="/">
              <h1 className="text-3xl font-black uppercase tracking-tighter font-headline leading-none">
                BELLINGHAM<br />
                <span className="text-primary italic">BREAKING</span> NEWS
              </h1>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed font-serif italic">
              Independent, citizen-funded journalism for the City of Bellingham. We provide real-time reporting on the stories that define our community.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-black uppercase text-[11px] tracking-[0.4em] mb-12 text-primary border-b border-primary/20 pb-4">
              Categories
            </h4>
            <ul className="space-y-5 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
              {categories.map(cat => (
                <li key={cat.name}>
                  <Link href={cat.href} className="hover:text-primary cursor-pointer transition">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Categories */}
          <div>
            <h4 className="font-black uppercase text-[11px] tracking-[0.4em] mb-12 text-primary border-b border-primary/20 pb-4">
              More
            </h4>
            <ul className="space-y-5 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
              {moreCategories.map(cat => (
                <li key={cat.name}>
                  <Link href={cat.href} className="hover:text-primary cursor-pointer transition">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Weekly Briefing Subscribe */}
          <div className="bg-white/5 p-8 md:p-12 rounded shadow-2xl border border-white/5">
            <h4 className="font-black uppercase text-xs mb-4 tracking-widest text-primary">
              Weekly Briefing
            </h4>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed font-serif italic">
              Get the week&apos;s top Bellingham stories delivered every Friday at 7AM.
            </p>

            {status === 'success' ? (
              <div className="flex items-center gap-3 text-accent">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm">Check your email to confirm!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  disabled={status === 'loading'}
                  className="w-full bg-white/5 border border-white/10 p-4 mb-4 text-xs focus:outline-none focus:border-primary text-white placeholder-gray-500 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-primary text-white w-full py-4 font-black uppercase text-xs tracking-widest hover:bg-white hover:text-secondary transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Subscribe Free'
                  )}
                </button>
              </form>
            )}
            {status === 'error' && (
              <p className="text-primary text-xs mt-3">Failed to subscribe. Try again.</p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-16 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[10px] font-black uppercase text-gray-500 tracking-[0.3em]">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <span>&copy; {currentYear} Bellingham Breaking News</span>
            <span className="hidden md:block w-2 h-2 bg-gray-800 rounded-full"></span>
            <Link href="/about" className="hover:text-primary transition">About</Link>
            <Link href="/submit-tip" className="hover:text-primary transition">Submit a Tip</Link>
          </div>
          <div className="flex gap-8 md:gap-12 mt-8 md:mt-0">
            <Link href="/privacy" className="hover:text-primary transition">Privacy</Link>
            <Link href="/terms" className="hover:text-primary transition">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
