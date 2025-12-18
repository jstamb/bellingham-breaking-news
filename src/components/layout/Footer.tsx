'use client';

import Link from 'next/link';
import { useState } from 'react';

const areas = [
  { name: 'Fairhaven District', href: '/category/fairhaven' },
  { name: 'Downtown Core', href: '/category/local' },
  { name: 'Lake Whatcom', href: '/category/whatcom-falls' },
  { name: 'Chuckanut Coast', href: '/category/waterfront' },
  { name: 'Happy Valley', href: '/category/local' },
];

const departments = [
  { name: 'Public Safety', href: '/category/police-fire' },
  { name: 'Campus Life', href: '/category/wwu' },
  { name: 'Local Business', href: '/category/business' },
  { name: 'Environment', href: '/category/weather' },
  { name: 'Waterfront', href: '/category/waterfront' },
];

export default function Footer() {
  const [phone, setPhone] = useState('');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-white pt-32 pb-16 mt-32 border-t-8 border-primary">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          {/* Brand Section */}
          <div className="space-y-10">
            <h1 className="text-4xl font-black uppercase tracking-tighter font-headline">
              BBN <span className="text-primary italic">BREAKING</span>
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed font-serif italic">
              Independent, citizen-funded journalism for the City of Bellingham. We provide real-time reporting on the stories that define our community.
            </p>
            <div className="flex gap-4">
              {['FB', 'TW', 'IG', 'YT'].map(social => (
                <a
                  key={social}
                  href="#"
                  className="w-12 h-12 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:bg-primary transition cursor-pointer font-black text-xs"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Our Town */}
          <div>
            <h4 className="font-black uppercase text-[11px] tracking-[0.4em] mb-12 text-primary border-b border-primary/20 pb-4">
              Our Town
            </h4>
            <ul className="space-y-5 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
              {areas.map(area => (
                <li key={area.name}>
                  <Link href={area.href} className="hover:text-primary cursor-pointer transition">
                    {area.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Departments */}
          <div>
            <h4 className="font-black uppercase text-[11px] tracking-[0.4em] mb-12 text-primary border-b border-primary/20 pb-4">
              Departments
            </h4>
            <ul className="space-y-5 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
              {departments.map(dept => (
                <li key={dept.name}>
                  <Link href={dept.href} className="hover:text-primary cursor-pointer transition">
                    {dept.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency Alerts */}
          <div className="bg-white/5 p-12 rounded shadow-2xl border border-white/5">
            <h4 className="font-black uppercase text-xs mb-8 tracking-widest text-primary">
              Emergency Alerts
            </h4>
            <p className="text-xs text-gray-400 mb-8 leading-relaxed font-serif italic">
              Sign up for real-time Bellingham incident notifications via SMS.
            </p>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (360) 000-0000"
              className="w-full bg-white/5 border border-white/10 p-5 mb-5 text-xs focus:outline-none focus:border-primary text-white font-mono"
            />
            <button className="bg-primary text-white w-full py-5 font-black uppercase text-xs tracking-widest hover:bg-white hover:text-secondary transition-all">
              Sign Up Now
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-16 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[10px] font-black uppercase text-gray-500 tracking-[0.3em]">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <span>&copy; {currentYear} Bellingham Breaking News Media Group</span>
            <span className="hidden md:block w-2 h-2 bg-gray-800 rounded-full"></span>
            <span className="text-primary italic">Verified Independent Source</span>
          </div>
          <div className="flex gap-12 mt-10 md:mt-0">
            <Link href="/privacy" className="hover:text-primary transition">Privacy</Link>
            <Link href="/terms" className="hover:text-primary transition">Terms</Link>
            <Link href="/about" className="hover:text-primary transition">Ethics</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
