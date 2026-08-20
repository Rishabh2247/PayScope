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
      <div className="bg-white p-5 rounded-3xl border border-[#BFE5D3] shadow-sm flex flex-col justify-between h-full min-h-[380px] space-y-4 hover:border-[#1F8F68] transition-colors">
        {/* Title */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-bold text-[#12372A]">Cost of Living</h3>
              <span className="text-xs text-[#1F8F68] font-semibold">(Monthly)</span>
            </div>
            <p className="text-xs text-slate-500">{economic.cityLabel}</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-xs font-bold text-[#1F8F68] hover:text-[#176F52] inline-flex items-center gap-1"
          >
            <span>See details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Main Metric */}
        <div>
          <div className="text-3xl font-black text-[#12372A]">
            {formatCurrency(economic.colTotalMonthly, inputs.currency)}
          </div>
          <p className="text-xs text-slate-500 font-medium">Estimated total monthly expenses</p>
        </div>

        {/* Categories Bar Chart Breakdown */}
        <div className="space-y-2.5">
          {economic.colCategories.map((cat, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2 text-[#12372A]">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span>{cat.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#12372A]">{formatCurrency(cat.amount, inputs.currency)}</span>
                  <span className="text-[11px] font-semibold text-slate-400 w-10 text-right">
                    {formatPercent(cat.percentage)}
                  </span>
                </div>
              </div>
              {/* Progress Bar Container */}
              <div className="w-full bg-[#F3FBF7] border border-[#BFE5D3]/40 rounded-full h-1.5 overflow-hidden">
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
        <div className="flex items-center justify-between pt-2 border-t border-[#BFE5D3]/60 text-xs">
          <span className="text-slate-500 font-medium">{economic.colComparisonText}</span>
          <span className="bg-[#EAF7F1] text-[#1F8F68] text-xs font-extrabold px-2.5 py-1 rounded-full border border-[#BFE5D3]">
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
