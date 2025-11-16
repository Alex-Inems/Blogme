'use client';

import { useState, useEffect } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

const DarkModeToggle: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  // Load dark mode preference from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      const darkModeEnabled = savedMode === 'true';
      setIsDarkMode(darkModeEnabled);
      if (darkModeEnabled) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      // Check system preference if no saved preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  // Toggle dark mode by adding/removing the dark class to the root element
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('darkMode', newMode.toString());
      return newMode;
    });
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="w-14 h-8 rounded-full bg-gray-200 dark:bg-zinc-700" />
    );
  }

  const ariaLabel = isDarkMode ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      onClick={toggleDarkMode}
      type="button"
      className="relative inline-flex items-center justify-center w-14 h-8 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-800 hover:scale-105 active:scale-95"
      aria-label={ariaLabel}
    >
      {/* Background track */}
      <div
        className={`absolute inset-0 rounded-full transition-all duration-300 ease-in-out shadow-inner ${isDarkMode
          ? 'bg-gradient-to-r from-zinc-800 to-zinc-900'
          : 'bg-gradient-to-r from-orange-400 to-orange-500'
          }`}
      />

      {/* Toggle circle with icon */}
      <div
        className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 ease-in-out transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0'
          }`}
      >
        {isDarkMode ? (
          <FiMoon className="w-4 h-4 text-zinc-700 transition-all duration-300" />
        ) : (
          <FiSun className="w-4 h-4 text-orange-500 transition-all duration-300" />
        )}
      </div>

      {/* Stars in dark mode */}
      {isDarkMode && (
        <>
          <div className="absolute top-2 left-3 w-1 h-1 bg-white rounded-full opacity-60 animate-pulse" />
          <div className="absolute top-3 left-5 w-0.5 h-0.5 bg-white rounded-full opacity-40 animate-pulse [animation-delay:0.5s]" />
          <div className="absolute top-4 left-4 w-0.5 h-0.5 bg-white rounded-full opacity-50 animate-pulse [animation-delay:1s]" />
        </>
      )}
    </button>
  );
};

export default DarkModeToggle;
