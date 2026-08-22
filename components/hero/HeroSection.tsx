'use client';

import React from 'react';
import { CompleteFinancialSnapshot, FinancialInputs } from '../../lib/types';
import { useTranslation } from '../../lib/i18n';
import { DetailsForm } from './DetailsForm';
import { SnapshotCard } from './SnapshotCard';
import { FeatureBar } from './FeatureBar';
import { ShieldCheck, Scale, Building2, BarChart3, Fuel, Home, Globe } from 'lucide-react';

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
      <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3">
        {/* Top Data Badge Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#EAF7F1] dark:bg-[#151C17] border border-[#BFE5D3] dark:border-[#26302A] rounded-full text-xs font-bold text-[#1F8F68] dark:text-[#22C55E] shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-[#1F8F68] dark:text-[#22C55E]" />
          <span>{t.backedByOfficialData}</span>
        </div>

        {/* Main Centered Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#12372A] dark:text-[#F9FAFB] tracking-tight leading-[1.0] sm:leading-[1.05]">
          <span>Your income.</span>{' '}
          <span className="text-[#1F8F68] dark:text-[#22C55E] font-great-vibes font-normal text-4xl sm:text-6xl lg:text-7xl align-baseline inline-block px-1 leading-none">Decoded.</span>
          <span className="block mt-1 sm:mt-2 text-3xl sm:text-5xl lg:text-6xl font-normal">{t.allInOnePlace}</span>
        </h1>

        {/* Subtitle with Refined Compact Font Size & Tight Vertical Spacing */}
        <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-normal max-w-xl mx-auto leading-relaxed pt-1">
          {t.heroSubtitle}
        </p>
      </div>

      {/* Floating / Corner Compact Social Proof Card */}
      <div className="flex justify-end -mt-6 -mb-4 pr-2">
        <div className="bg-white/95 dark:bg-[#101512]/95 backdrop-blur-md border border-[#BFE5D3] dark:border-[#26302A] rounded-2xl p-3 shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-3 shrink-0 max-w-xs">
          <div className="space-y-0.5">
            <h2 className="text-xs font-black text-[#1F8F68] dark:text-[#22C55E] leading-tight whitespace-nowrap">
              {t.trustedByThousands}
            </h2>
            <p className="text-[10px] font-normal text-slate-800 dark:text-slate-300 whitespace-nowrap">
              {t.acrossNorthAmerica}
            </p>
          </div>

          <div className="flex items-center -space-x-2 shrink-0">
            <img
              width={28}
              height={28}
              loading="lazy"
              decoding="async"
              className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-[#101512] object-cover shadow-2xs"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
              alt="User 1"
            />
            <img
              width={28}
              height={28}
              loading="lazy"
              decoding="async"
              className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-[#101512] object-cover shadow-2xs"
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
              alt="User 2"
            />
            <img
              width={28}
              height={28}
              loading="lazy"
              decoding="async"
              className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-[#101512] object-cover shadow-2xs"
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
              alt="User 3"
            />
            <div className="w-7 h-7 rounded-full bg-[#1F8F68] dark:bg-[#22C55E] text-white font-black text-[9px] flex items-center justify-center ring-2 ring-white dark:ring-[#101512] shadow-xs">
              10K+
            </div>
          </div>
        </div>
      </div>

      {/* Main Unified Card (2-Column Grid) */}
      <div className="bg-white dark:bg-[#101512] rounded-3xl border border-[#BFE5D3] dark:border-[#26302A] shadow-xl shadow-slate-200/50 dark:shadow-none p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
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
      <div className="pt-12 text-center space-y-4 border-t border-[#BFE5D3]/60 dark:border-[#26302A]">
        <p className="text-xs font-extrabold uppercase tracking-wider text-[#1F8F68] dark:text-[#22C55E]">
          <span className="font-black">O</span>fficial <span className="font-black">V</span>erified <span className="font-black">D</span>ata <span className="font-black">S</span>ources
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-bold text-[#12372A] dark:text-[#F9FAFB]">
          <div className="flex items-center gap-1.5 bg-[#F3FBF7] dark:bg-[#151C17] px-3.5 py-1.5 rounded-xl border border-[#BFE5D3] dark:border-[#26302A]">
            <Scale className="w-3.5 h-3.5 text-[#1F8F68] dark:text-[#22C55E]" /> IRS Tax Code
          </div>
          <div className="flex items-center gap-1.5 bg-[#F3FBF7] dark:bg-[#151C17] px-3.5 py-1.5 rounded-xl border border-[#BFE5D3] dark:border-[#26302A]">
            <Building2 className="w-3.5 h-3.5 text-[#1F8F68] dark:text-[#22C55E]" /> CRA Agency
          </div>
          <div className="flex items-center gap-1.5 bg-[#F3FBF7] dark:bg-[#151C17] px-3.5 py-1.5 rounded-xl border border-[#BFE5D3] dark:border-[#26302A]">
            <BarChart3 className="w-3.5 h-3.5 text-[#1F8F68] dark:text-[#22C55E]" /> Statistics Canada
          </div>
          <div className="flex items-center gap-1.5 bg-[#F3FBF7] dark:bg-[#151C17] px-3.5 py-1.5 rounded-xl border border-[#BFE5D3] dark:border-[#26302A]">
            <Fuel className="w-3.5 h-3.5 text-[#1F8F68] dark:text-[#22C55E]" /> U.S. EIA Energy Data
          </div>
          <div className="flex items-center gap-1.5 bg-[#F3FBF7] dark:bg-[#151C17] px-3.5 py-1.5 rounded-xl border border-[#BFE5D3] dark:border-[#26302A]">
            <Home className="w-3.5 h-3.5 text-[#1F8F68] dark:text-[#22C55E]" /> Zillow Index
          </div>
          <div className="flex items-center gap-1.5 bg-[#F3FBF7] dark:bg-[#151C17] px-3.5 py-1.5 rounded-xl border border-[#BFE5D3] dark:border-[#26302A]">
            <BarChart3 className="w-3.5 h-3.5 text-[#1F8F68] dark:text-[#22C55E]" /> U.S. BLS Labor Stats
          </div>
          <div className="flex items-center gap-1.5 bg-[#F3FBF7] dark:bg-[#151C17] px-3.5 py-1.5 rounded-xl border border-[#BFE5D3] dark:border-[#26302A]">
            <Building2 className="w-3.5 h-3.5 text-[#1F8F68] dark:text-[#22C55E]" /> Receita Federal
          </div>
          <div className="flex items-center gap-1.5 bg-[#F3FBF7] dark:bg-[#151C17] px-3.5 py-1.5 rounded-xl border border-[#BFE5D3] dark:border-[#26302A]">
            <Scale className="w-3.5 h-3.5 text-[#1F8F68] dark:text-[#22C55E]" /> SAT Tax Authority
          </div>
        </div>
      </div>
    </section>
  );
};
