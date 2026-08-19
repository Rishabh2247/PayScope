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
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  inputs,
  snapshot,
  onInputsChange,
  onCalculate,
}) => {
  const { t } = useTranslation();

  return (
    <section className="py-8 sm:py-12 space-y-12 bg-[#ffffff] [background-image:linear-gradient(to_right,_rgba(0,_0,_0,_0.05)_1px,_transparent_1px),_linear-gradient(to_bottom,_rgba(0,_0,_0,_0.05)_1px,_transparent_1px)] [background-size:37px_37px] rounded-3xl p-4 sm:p-8 border border-slate-100/80 shadow-2xs relative overflow-hidden">
      {/* Title & Headline Banner */}
      <div className="max-w-3xl space-y-4 relative z-10">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
          {t.heroTitle1}{' '}
          <span className="block font-black text-slate-900">{t.heroTitle2}</span>
          <span className="block bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
            {t.heroTitle3}
          </span>
        </h1>
        <p className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed max-w-2xl">
          {t.heroSub}
        </p>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        {/* Left Form: Your Details (5 cols) */}
        <div className="lg:col-span-5">
          <DetailsForm inputs={inputs} onChange={onInputsChange} onCalculate={onCalculate} />
        </div>

        {/* Right Preview Card: Your Financial Snapshot (7 cols) */}
        <div className="lg:col-span-7">
          <SnapshotCard snapshot={snapshot} onExploreDashboard={onCalculate} />
        </div>
      </div>

      {/* Bottom Feature Cards */}
      <div className="relative z-10">
        <FeatureBar onSelectFeature={() => onCalculate()} />
      </div>
    </section>
  );
};
