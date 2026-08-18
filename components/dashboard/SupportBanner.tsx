'use client';

import React from 'react';
import { Coffee, ArrowRight } from 'lucide-react';

export const SupportBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 sm:p-7 text-white shadow-lg shadow-amber-200/60 flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden">
      {/* Background Decorative Graphic Pattern */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-white/5 skew-x-12 pointer-events-none" />

      <div className="flex items-center gap-4 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
          <Coffee className="w-6 h-6 text-white" />
        </div>
        <div className="space-y-0.5 text-center sm:text-left">
          <h3 className="text-lg font-black tracking-tight">Enjoying PayScope?</h3>
          <p className="text-xs text-amber-100 font-medium max-w-md">
            PayScope is independently developed & maintained. Support the project to keep tools free and active!
          </p>
        </div>
      </div>

      <a
        href="https://buymeacoffee.com/rishabh2247"
        target="_blank"
        rel="noopener noreferrer"
        className="relative z-10 px-5 py-3 bg-white hover:bg-slate-50 text-amber-900 font-bold text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 group shrink-0 active:scale-95"
      >
        <span>☕ Buy Me a Coffee</span>
        <ArrowRight className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition-transform" />
      </a>
    </div>
  );
};
