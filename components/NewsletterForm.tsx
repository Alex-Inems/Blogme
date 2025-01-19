'use client';

import { useState } from 'react';
import { FaEnvelope } from 'react-icons/fa'; // For the subscribe icon

const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setMessage('You must agree to our terms to subscribe.');
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
        setEmail('');
      } else {
        setMessage('There was an error subscribing.');
      }
    } catch (error) {
      setMessage('There was an error subscribing.');
    }
  };

  return (
    <div className=" flex flex-col items-center bg-slate-900 p-8 rounded-lg shadow-lg mt-10 w-full">
      <h2 className="text-white text-2xl font-bold mb-4">Stay Updated!</h2>
      <p className="text-white mb-6">Subscribe to our newsletter and never miss out on updates.</p>
      <form onSubmit={handleSubmit} className="w-full">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-transparent p-3 w-full rounded-md border-b-2 border-gray-300 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="consent"
            checked={consent}
            onChange={() => setConsent(!consent)}
            className="mr-2"
          />
          <label htmlFor="consent" className="text-white text-sm">
            I agree to the <a href="/terms" className="text-blue-300">terms and conditions</a><br/>
            I consent to receive promotional and announcement emails

By selecting on the toggle you agreed to receive newsletter and promotional emails from foundo.io.
          </label>
        </div>
        <button
          type="submit"
          className="w-32 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center"
        >
          <FaEnvelope className="mr-2" /> Subscribe
        </button>
      </form>
      {message && <p className="mt-4 text-white text-center">{message}</p>}
    </div>
  );
};

export default NewsletterForm;
