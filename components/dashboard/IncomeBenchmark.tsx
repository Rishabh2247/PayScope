'use client';

import React from 'react';
import { CompleteFinancialSnapshot } from '../../lib/types';
import { formatCurrency, isContractorRole } from '../../lib/formatters';
import { Info } from 'lucide-react';

interface IncomeBenchmarkProps {
  snapshot: CompleteFinancialSnapshot;
}

export const IncomeBenchmark: React.FC<IncomeBenchmarkProps> = ({ snapshot }) => {
  const { economic, inputs, tax } = snapshot;
  const isContractor = isContractorRole(inputs.employmentType);

  // For contractors, compare estimated owner personal compensation/draw (NOT total corporate contract revenue!)
  const benchmarkComparisonAmount = isContractor
    ? (tax.estimatedPersonalTakeHome || tax.ownerCompensation || tax.takeHomePayAnnual)
    : tax.annualGross;

  return (
    <div className="bg-white dark:bg-[#101512] p-5 rounded-3xl border border-[#BFE5D3] dark:border-[#26302A] shadow-sm flex flex-col justify-between h-full min-h-[380px] space-y-4 hover:border-[#1F8F68] dark:hover:border-[#22C55E]/50 transition-colors">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-[#12372A] dark:text-[#F9FAFB]">Income vs Local Benchmark</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isContractor ? 'Estimated personal income benchmark in' : 'Household benchmark in'} {economic.cityLabel}
          </p>
        </div>
        <Info className="w-4 h-4 text-[#1F8F68] dark:text-[#22C55E] cursor-pointer" />
      </div>

      {/* Percentile Highlight */}
      <div className="space-y-0.5">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {isContractor ? 'Your estimated personal income ranks above' : 'You earn more than'}
        </p>
        <div className="text-4xl font-black text-[#1F8F68] dark:text-[#22C55E] tracking-tight">78%</div>
        <p className="text-xs font-bold text-[#12372A] dark:text-[#F9FAFB]">of households in {economic.cityLabel}</p>
      </div>

      {/* Vertical Scale Visualization */}
      <div className="bg-[#F3FBF7] dark:bg-[#151C17] p-3.5 rounded-2xl border border-[#BFE5D3] dark:border-[#26302A] relative space-y-2 text-xs font-semibold">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px]">
          <span>Top 10%</span>
          <span className="font-bold text-[#12372A] dark:text-[#F9FAFB]">{formatCurrency(economic.benchmarkTop10, inputs.currency)}+</span>
        </div>

        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px]">
          <span>Top 25%</span>
          <span className="font-bold text-[#12372A] dark:text-[#F9FAFB]">{formatCurrency(economic.benchmarkTop25, inputs.currency)}+</span>
        </div>

        {/* Your Income Level Highlight Box */}
        <div className="bg-[#1F8F68] dark:bg-[#22C55E] text-white dark:text-[#080B09] p-2.5 rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-1.5 font-bold text-xs">
            <span className="w-2 h-2 rounded-full bg-white dark:bg-[#080B09] animate-pulse" />
            <span>{isContractor ? 'Est. Personal Income' : 'Your Income'}</span>
          </div>
          <span className="text-sm font-black">{formatCurrency(benchmarkComparisonAmount, inputs.currency)}</span>
        </div>

        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px]">
          <span>Median</span>
          <span className="font-bold text-[#12372A] dark:text-[#F9FAFB]">{formatCurrency(economic.benchmarkMedian, inputs.currency)}</span>
        </div>

        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px]">
          <span>Bottom 25%</span>
          <span className="font-bold text-[#12372A] dark:text-[#F9FAFB]">&lt;{formatCurrency(economic.benchmarkBottom25, inputs.currency)}</span>
        </div>
      </div>

      {/* Footnote */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-400 pt-2 border-t border-[#BFE5D3]/60 dark:border-[#26302A]">
        <span>Source: Official Regional Census</span>
        <span className="font-bold text-[#1F8F68] dark:text-[#22C55E]">2026 Data</span>
      </div>
    </div>
  );
};
