'use client';

import { useState } from 'react';
import { Loader2, CheckCircle } from 'lucide-react';

export default function NewsletterWidget() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Check your email to confirm!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong.');
      }
    } catch {
      setStatus('error');
      setMessage('Failed to subscribe. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-lightGray p-10 rounded shadow-sm border border-gray-200 relative overflow-hidden">
        <div className="flex items-center gap-3 text-accent">
          <CheckCircle className="w-6 h-6" />
          <div>
            <p className="font-bold text-secondary">You&apos;re subscribed!</p>
            <p className="text-sm text-gray-600">{message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-lightGray p-10 rounded shadow-sm border border-gray-200 relative overflow-hidden">
      <div className="relative z-10">
        <h4 className="font-headline text-2xl font-bold mb-4 text-secondary">
          The Weekly Briefing
        </h4>
        <p className="text-sm text-gray-600 mb-8 leading-relaxed font-serif">
          A curated summary of the week&apos;s local stories, delivered to your inbox every Friday at 7AM.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            required
            disabled={status === 'loading'}
            className="w-full p-4 border border-gray-300 focus:border-primary outline-none text-xs font-bold uppercase tracking-widest disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-primary text-white py-4 font-black uppercase text-xs tracking-widest hover:bg-secondary transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {status === 'loading' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Activate Free Subscription'
            )}
          </button>
        </form>
        {status === 'error' && (
          <p className="text-primary text-sm mt-4">{message}</p>
        )}
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16"></div>
    </div>
  );
}
