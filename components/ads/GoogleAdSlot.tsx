'use client';

import React from 'react';

interface GoogleAdSlotProps {
  type?: 'leaderboard' | 'rectangle' | 'skyscraper' | 'in-feed';
  className?: string;
  adSlotId?: string;
}

export const GoogleAdSlot: React.FC<GoogleAdSlotProps> = ({
  type = 'leaderboard',
  className = '',
  adSlotId = '1234567890',
}) => {
  const getSlotDimensions = () => {
    switch (type) {
      case 'leaderboard':
        return 'h-24 sm:h-28 w-full max-w-[970px]';
      case 'rectangle':
        return 'h-64 w-full max-w-[336px]';
      case 'skyscraper':
        return 'h-[600px] w-full max-w-[300px]';
      case 'in-feed':
        return 'h-32 w-full max-w-[1200px]';
      default:
        return 'h-24 w-full';
    }
  };

  return (
    <div className={`my-4 flex flex-col items-center justify-center mx-auto ${className}`}>
      {/* Small Ad Label */}
      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
        <span>ADVERTISEMENT • Google AdSense</span>
      </div>

      {/* Ad Container Box */}
      <div
        className={`relative bg-gradient-to-br from-slate-50 via-slate-100/70 to-slate-50 border border-dashed border-slate-300/80 rounded-2xl flex flex-col items-center justify-center p-4 text-center overflow-hidden group hover:border-slate-400 transition-colors shadow-2xs ${getSlotDimensions()}`}
      >
        {/* Decorative Ad Placeholder Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f015_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f015_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-1 bg-white/80 border border-slate-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-slate-500 shadow-2xs">
            <span>Google Ad</span>
            <span className="text-slate-400">•</span>
            <span className="text-indigo-600">Slot #{adSlotId}</span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            {type === 'leaderboard' && 'Responsive Leaderboard (728x90 / 970x90)'}
            {type === 'rectangle' && 'Medium Rectangle Ad (300x250 / 336x280)'}
            {type === 'skyscraper' && 'Half-Page Skyscraper Ad (300x600)'}
            {type === 'in-feed' && 'Native In-Feed Responsive Banner'}
          </p>
        </div>

        {/* Real AdSense Ins Tag Template (Commented for Production Script Injection) */}
        {/* 
        <ins className="adsbygoogle"
             style={{ display: 'block' }}
             data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
             data-ad-slot={adSlotId}
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
        */}
      </div>
    </div>
  );
};
