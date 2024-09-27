// lib/firebase-analytics.ts
import { getAnalytics, isSupported } from 'firebase/analytics';
import { app } from './firebase'; // Import your Firebase app

// This will only be used in the browser
export const initializeAnalytics = async () => {
  if (typeof window !== 'undefined') {
    // Check if analytics is supported and initialize
    const supported = await isSupported();
    if (supported) {
      return getAnalytics(app);
    } else {
      console.log('Analytics is not supported in this environment.');
    }
  }
};
