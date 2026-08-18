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
    <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between h-full min-h-[380px] space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Income vs Local Benchmark</h3>
          <p className="text-xs text-slate-400">
            {isContractor ? 'Estimated personal income benchmark in' : 'Household benchmark in'} {economic.cityLabel}
          </p>
        </div>
        <Info className="w-4 h-4 text-slate-400 cursor-pointer" />
      </div>

      {/* Percentile Highlight */}
      <div className="space-y-0.5">
        <p className="text-xs font-semibold text-slate-500">
          {isContractor ? 'Your estimated personal income ranks above' : 'You earn more than'}
        </p>
        <div className="text-4xl font-black text-emerald-600 tracking-tight">78%</div>
        <p className="text-xs font-semibold text-slate-600">of households in {economic.cityLabel}</p>
      </div>

      {/* Vertical Scale Visualization */}
      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 relative space-y-2 text-xs font-semibold">
        <div className="flex items-center justify-between text-slate-400 text-[11px]">
          <span>Top 10%</span>
          <span className="font-bold text-slate-700">{formatCurrency(economic.benchmarkTop10, inputs.currency)}+</span>
        </div>

        <div className="flex items-center justify-between text-slate-400 text-[11px]">
          <span>Top 25%</span>
          <span className="font-bold text-slate-700">{formatCurrency(economic.benchmarkTop25, inputs.currency)}+</span>
        </div>

        {/* Your Income Level Highlight Box */}
        <div className="bg-emerald-500 text-white p-2.5 rounded-xl flex items-center justify-between shadow-sm shadow-emerald-200">
          <div className="flex items-center gap-1.5 font-bold text-xs">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>{isContractor ? 'Est. Personal Income' : 'Your Income'}</span>
          </div>
          <span className="text-sm font-black">{formatCurrency(benchmarkComparisonAmount, inputs.currency)}</span>
        </div>

        <div className="flex items-center justify-between text-slate-400 text-[11px]">
          <span>Median</span>
          <span className="font-bold text-slate-700">{formatCurrency(economic.benchmarkMedian, inputs.currency)}</span>
        </div>

        <div className="flex items-center justify-between text-slate-400 text-[11px]">
          <span>Bottom 25%</span>
          <span className="font-bold text-slate-700">&lt;{formatCurrency(economic.benchmarkBottom25, inputs.currency)}</span>
        </div>
      </div>

      {/* Footnote */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
        <span>Source: Official Regional Census</span>
        <span className="font-semibold text-slate-500">2024</span>
      </div>
    </div>
  );
};
