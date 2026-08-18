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
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between h-full min-h-[380px] space-y-4">
        {/* Title */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-bold text-slate-900">Cost of Living</h3>
              <span className="text-xs text-slate-400 font-semibold">(Monthly)</span>
            </div>
            <p className="text-xs text-slate-400">{economic.cityLabel}</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
          >
            <span>See details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Main Metric */}
        <div>
          <div className="text-3xl font-black text-slate-900">
            {formatCurrency(economic.colTotalMonthly, inputs.currency)}
          </div>
          <p className="text-xs text-slate-400 font-medium">Estimated total monthly expenses</p>
        </div>

        {/* Categories Bar Chart Breakdown */}
        <div className="space-y-2.5">
          {economic.colCategories.map((cat, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span>{cat.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900">{formatCurrency(cat.amount, inputs.currency)}</span>
                  <span className="text-[11px] font-semibold text-slate-400 w-10 text-right">
                    {formatPercent(cat.percentage)}
                  </span>
                </div>
              </div>
              {/* Progress Bar Container */}
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
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
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-500 font-medium">{economic.colComparisonText}</span>
          <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-100">
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
