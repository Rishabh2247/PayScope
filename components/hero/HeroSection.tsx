'use client';

import React from 'react';
import { CompleteFinancialSnapshot, FinancialInputs } from '../../lib/types';
import { useTranslation } from '../../lib/i18n';
import { DetailsForm } from './DetailsForm';
import { SnapshotCard } from './SnapshotCard';
import { FeatureBar } from './FeatureBar';

interface HeroSectionProps {
  inputs: FinancialInputs;
  snapshot: CompleteFinancialSnapshot;
  onInputsChange: (inputs: FinancialInputs) => void;
  onCalculate: () => void;
  onCountryChange?: (country: any) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  inputs,
  snapshot,
  onInputsChange,
  onCalculate,
  onCountryChange,
}) => {
  const { t } = useTranslation();

  return (
    <section className="py-8 sm:py-14 space-y-12 relative max-w-6xl mx-auto page-fade-in">
      {/* Centered Hero Title & Top Pill Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        {/* Top Data Badge Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#EAF7F1] border border-[#BFE5D3] rounded-full text-xs font-bold text-[#1F8F68] shadow-2xs">
          <span>🛡️</span>
          <span>{t.backedByOfficialData}</span>
        </div>

        {/* Main Centered Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#12372A] tracking-tight leading-[1.15]">
          Your income. <span className="text-[#1F8F68]">Decoded.</span> <br />
          {t.allInOnePlace}
        </h1>

        {/* Subtitle */}
        <p className="text-slate-600 text-sm sm:text-base font-medium max-w-2xl mx-auto leading-relaxed">
          {t.heroSubtitle}
        </p>
      </div>

      {/* Floating / Corner Compact Social Proof Card */}
      <div className="flex justify-end -mt-6 -mb-4 pr-2">
        <div className="bg-white/95 backdrop-blur-md border border-[#BFE5D3] rounded-2xl p-3 shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-3 shrink-0 max-w-xs">
          <div className="space-y-0.5">
            <h4 className="text-xs font-black text-[#1F8F68] leading-tight whitespace-nowrap">
              {t.trustedByThousands}
            </h4>
            <p className="text-[10px] font-bold text-slate-500 whitespace-nowrap">
              {t.acrossNorthAmerica}
            </p>
          </div>

          <div className="flex items-center -space-x-2 shrink-0">
            <img
              className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover shadow-2xs"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
              alt="User 1"
            />
            <img
              className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover shadow-2xs"
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
              alt="User 2"
            />
            <img
              className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover shadow-2xs"
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
              alt="User 3"
            />
            <div className="w-7 h-7 rounded-full bg-[#1F8F68] text-white font-black text-[9px] flex items-center justify-center ring-2 ring-white shadow-xs">
              10K+
            </div>
          </div>
        </div>
      </div>

      {/* Main Unified White Card (2-Column Grid) */}
      <div className="bg-white rounded-3xl border border-[#BFE5D3] shadow-xl shadow-slate-200/50 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Form: Your Financial Details (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <DetailsForm
            inputs={inputs}
            onChange={onInputsChange}
            onCalculate={onCalculate}
            onCountryChange={onCountryChange}
          />
        </div>

        {/* Right Dark Live Preview Card (5 cols) */}
        <div className="lg:col-span-5">
          <SnapshotCard snapshot={snapshot} onExploreDashboard={onCalculate} />
        </div>
      </div>

      {/* "Everything that shapes your paycheck" Feature Grid */}
      <FeatureBar onSelectFeature={() => onCalculate()} />

      {/* Official Data Sources Row */}
      <div className="pt-12 text-center space-y-4 border-t border-[#BFE5D3]/60">
        <p className="text-xs font-extrabold uppercase tracking-wider text-[#1F8F68]">
          Official verified data sources
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-bold text-[#12372A]">
          <div className="flex items-center gap-1.5 bg-[#F3FBF7] px-3.5 py-1.5 rounded-xl border border-[#BFE5D3]">
            <span>🇺🇸</span> IRS Tax Code
          </div>
          <div className="flex items-center gap-1.5 bg-[#F3FBF7] px-3.5 py-1.5 rounded-xl border border-[#BFE5D3]">
            <span>🇨🇦</span> CRA Agency
          </div>
          <div className="flex items-center gap-1.5 bg-[#F3FBF7] px-3.5 py-1.5 rounded-xl border border-[#BFE5D3]">
            <span>🇨🇦</span> Statistics Canada
          </div>
          <div className="flex items-center gap-1.5 bg-[#F3FBF7] px-3.5 py-1.5 rounded-xl border border-[#BFE5D3]">
            <span>🇺🇸</span> U.S. EIA Energy Data
          </div>
          <div className="flex items-center gap-1.5 bg-[#F3FBF7] px-3.5 py-1.5 rounded-xl border border-[#BFE5D3]">
            <span>🏠</span> Zillow Index
          </div>
          <div className="flex items-center gap-1.5 bg-[#F3FBF7] px-3.5 py-1.5 rounded-xl border border-[#BFE5D3]">
            <span>🇺🇸</span> U.S. BLS Labor Stats
          </div>
          <div className="flex items-center gap-1.5 bg-[#F3FBF7] px-3.5 py-1.5 rounded-xl border border-[#BFE5D3]">
            <span>🇧🇷</span> Receita Federal
          </div>
          <div className="flex items-center gap-1.5 bg-[#F3FBF7] px-3.5 py-1.5 rounded-xl border border-[#BFE5D3]">
            <span>🇲🇽</span> SAT Tax Authority
          </div>
        </div>
      </div>
    </section>
  );
};
