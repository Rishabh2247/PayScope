'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-xl border border-[#BFE5D3] dark:border-[#26302A] bg-white/80 dark:bg-[#101512]/80 opacity-0 pointer-events-none" />
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className="relative p-2 rounded-xl border border-[#BFE5D3] dark:border-[#26302A] bg-white/90 dark:bg-[#101512]/90 hover:bg-[#EAF7F1] dark:hover:bg-[#151C17] text-[#12372A] dark:text-[#F9FAFB] transition-all duration-300 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#1F8F68] dark:focus:ring-[#22C55E] cursor-pointer flex items-center justify-center shrink-0 group"
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        <Sun
          className={`w-4 h-4 text-amber-500 transition-all duration-300 transform ${
            isDark ? 'rotate-90 scale-0 absolute' : 'rotate-0 scale-100'
          }`}
        />
        <Moon
          className={`w-4 h-4 text-emerald-400 transition-all duration-300 transform ${
            isDark ? 'rotate-0 scale-100' : '-rotate-90 scale-0 absolute'
          }`}
        />
      </div>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};
