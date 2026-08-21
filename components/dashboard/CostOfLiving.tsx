'use client';

import React, { useState } from 'react';
import { CompleteFinancialSnapshot } from '../../lib/types';
import { formatCurrency, formatPercent } from '../../lib/formatters';
import { ArrowRight } from 'lucide-react';
import { FullBreakdownModal } from './FullBreakdownModal';

interface CostOfLivingProps {
  snapshot: CompleteFinancialSnapshot;
}

export const CostOfLiving: React.FC<CostOfLivingProps> = ({ snapshot }) => {
  const { economic, inputs } = snapshot;
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white dark:bg-[#101512] p-5 rounded-3xl border border-[#BFE5D3] dark:border-[#26302A] shadow-sm flex flex-col justify-between h-full min-h-[380px] space-y-4 hover:border-[#1F8F68] dark:hover:border-[#22C55E]/50 transition-colors">
        {/* Title */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-bold text-[#12372A] dark:text-[#F9FAFB]">Cost of Living</h3>
              <span className="text-xs text-[#1F8F68] dark:text-[#22C55E] font-semibold">(Monthly)</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{economic.cityLabel}</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-xs font-bold text-[#1F8F68] dark:text-[#22C55E] hover:text-[#176F52] dark:hover:text-[#16A34A] inline-flex items-center gap-1"
          >
            <span>See details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Main Metric */}
        <div>
          <div className="text-3xl font-black text-[#12372A] dark:text-[#F9FAFB]">
            {formatCurrency(economic.colTotalMonthly, inputs.currency)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Estimated total monthly expenses</p>
        </div>

        {/* Categories Bar Chart Breakdown */}
        <div className="space-y-2.5">
          {economic.colCategories.map((cat, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2 text-[#12372A] dark:text-[#F9FAFB]">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span>{cat.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#12372A] dark:text-[#F9FAFB]">{formatCurrency(cat.amount, inputs.currency)}</span>
                  <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 w-10 text-right">
                    {formatPercent(cat.percentage)}
                  </span>
                </div>
              </div>
              {/* Progress Bar Container */}
              <div className="w-full bg-[#F3FBF7] dark:bg-[#151C17] border border-[#BFE5D3]/40 dark:border-[#26302A]/40 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${cat.percentage}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Comparison Badge */}
        <div className="flex items-center justify-between pt-2 border-t border-[#BFE5D3]/60 dark:border-[#26302A] text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium">{economic.colComparisonText}</span>
          <span className="bg-[#EAF7F1] dark:bg-[#151C17] text-[#1F8F68] dark:text-[#22C55E] text-xs font-extrabold px-2.5 py-1 rounded-full border border-[#BFE5D3] dark:border-[#26302A]">
            Regional Data
          </span>
        </div>
      </div>

      <FullBreakdownModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        snapshot={snapshot}
        initialTab="living"
      />
    </>
  );
};
