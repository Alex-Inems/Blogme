'use client';

import { useState } from 'react';

const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setMessage('');
      setError('You must agree to our terms to subscribe.');
      return;
    }
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setMessage('You have successfully subscribed to the newsletter!');
        setError('');
        setEmail('');
      } else {
        setMessage('');
        setError('There was an error subscribing.');
      }
    } catch {
      setMessage('');
      setError('There was an error subscribing.');
    }
  };

  return (
    <div className="relative w-full">
      {/* Background with gradient and pattern */}
      <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 p-8 md:p-12 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/5 rounded-full"></div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Stay Updated</h2>
            <p className="text-lg text-orange-100 leading-relaxed max-w-2xl mx-auto">
              Join thousands of readers who get our best stories, insights, and writing tips delivered straight to their inbox.
              <span className="block mt-2 text-orange-200">No spam, just quality content that matters.</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex gap-3 items-center bg-white rounded-lg p-2 shadow-xl">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none bg-transparent"
                required
              />
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-md font-semibold transition-colors duration-200 whitespace-nowrap"
              >
                Subscribe
              </button>
            </div>
          </form>

          <div className="mt-6">
            <label className="flex items-center justify-center text-sm text-orange-100">
              <input
                type="checkbox"
                checked={consent}
                onChange={() => setConsent(!consent)}
                className="mr-3 text-orange-600 focus:ring-orange-500 rounded"
              />
              I agree to the <a href="/terms" className="text-white hover:text-orange-200 underline font-medium">terms and conditions</a>
            </label>
          </div>

          {message && (
            <div className="mt-4">
              <p className="text-green-200 text-sm bg-green-500/20 px-4 py-2 rounded-lg inline-block">{message}</p>
            </div>
          )}
          {error && (
            <div className="mt-4">
              <p className="text-red-200 text-sm bg-red-500/20 px-4 py-2 rounded-lg inline-block">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsletterForm;
