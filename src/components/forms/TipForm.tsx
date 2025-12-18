'use client';

import { useState } from 'react';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function TipForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    anonymous: false,
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact/tip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          anonymous: false,
        });
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Failed to send. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Failed to send. Please try again later.');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-20 h-20 text-accent mx-auto mb-6" />
        <h2 className="font-headline text-2xl font-bold text-secondary mb-4">
          Tip Received!
        </h2>
        <p className="text-gray-600 mb-8">
          Thank you for submitting your tip. Our news team will review it and may follow up if we need more information.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="bg-secondary text-white px-8 py-3 font-black uppercase text-xs tracking-widest hover:bg-primary transition"
        >
          Submit Another Tip
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Anonymous Toggle */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          name="anonymous"
          checked={formData.anonymous}
          onChange={handleChange}
          className="w-5 h-5 accent-primary"
        />
        <span className="text-sm text-gray-700">
          Submit anonymously (we won&apos;t require contact info)
        </span>
      </label>

      {!formData.anonymous && (
        <>
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required={!formData.anonymous}
              className="w-full p-4 border-2 border-gray-200 focus:border-primary outline-none"
              placeholder="John Doe"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required={!formData.anonymous}
              className="w-full p-4 border-2 border-gray-200 focus:border-primary outline-none"
              placeholder="john@example.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-2">
              Phone Number <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-200 focus:border-primary outline-none"
              placeholder="(360) 555-1234"
            />
          </div>
        </>
      )}

      {/* Subject */}
      <div>
        <label htmlFor="subject" className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-2">
          Subject / Topic
        </label>
        <select
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="w-full p-4 border-2 border-gray-200 focus:border-primary outline-none bg-white"
        >
          <option value="">Select a topic...</option>
          <option value="Breaking News">Breaking News</option>
          <option value="Local Government">Local Government</option>
          <option value="Crime / Police">Crime / Police</option>
          <option value="Business">Business</option>
          <option value="WWU / Education">WWU / Education</option>
          <option value="Environment">Environment</option>
          <option value="Community Event">Community Event</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-2">
          Your Tip / Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          className="w-full p-4 border-2 border-gray-200 focus:border-primary outline-none resize-none"
          placeholder="Tell us what you know. Include as much detail as possible: who, what, when, where, and any relevant context..."
        />
      </div>

      {/* Error Message */}
      {status === 'error' && (
        <div className="flex items-center gap-3 text-primary bg-red-50 p-4 rounded">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-primary text-white py-4 font-black uppercase text-sm tracking-widest hover:bg-secondary transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Sending...
          </>
        ) : (
          'Submit Tip'
        )}
      </button>

      <p className="text-[11px] text-gray-400 text-center">
        By submitting, you agree that the information provided is accurate to the best of your knowledge.
      </p>
    </form>
  );
}
