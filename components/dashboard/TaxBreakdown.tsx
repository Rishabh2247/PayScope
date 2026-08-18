'use client';

import React, { useState } from 'react';
import { CompleteFinancialSnapshot } from '../../lib/types';
import { formatCurrency, formatPercent, isContractorRole } from '../../lib/formatters';
import { ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { FullBreakdownModal } from './FullBreakdownModal';

interface TaxBreakdownProps {
  snapshot: CompleteFinancialSnapshot;
}

export const TaxBreakdown: React.FC<TaxBreakdownProps> = ({ snapshot }) => {
  const { tax, inputs } = snapshot;
  const isContractor = isContractorRole(inputs.employmentType);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatTaxName = (name: string) => {
    if (name.includes('Provincial Tax')) return 'Provincial Tax';
    if (name.includes('State Tax')) return 'State Tax';
    return name;
  };

  const data = tax.breakdown.map((item) => ({
    name: formatTaxName(item.name),
    value: Math.max(0, item.amount),
    color: item.color,
    percentage: item.percentage,
  }));

  return (
    <>
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between h-full space-y-4">
        {/* Title */}
        <div>
          <h3 className="text-base font-bold text-slate-900">
            {isContractor ? 'Contract Revenue Breakdown' : 'Take-Home Pay Breakdown'}
          </h3>
          <p className="text-xs text-slate-400">
            {isContractor ? 'Where contract revenue goes' : 'Where your money goes'}
          </p>
        </div>

        {/* Donut Chart & Center Text */}
        <div className="relative h-44 w-full flex items-center justify-center my-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={72}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => [formatCurrency(Number(value), inputs.currency), 'Amount']}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Donut Center Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-sm font-black text-slate-900">
              {formatCurrency(tax.grossIncome, inputs.currency, true)}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">
              {isContractor ? 'Contract Revenue' : 'Gross Income'}
            </span>
          </div>
        </div>

        {/* Itemized List */}
        <div className="space-y-1.5 text-xs">
          {tax.breakdown.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="font-semibold text-slate-700 truncate">{formatTaxName(item.name)}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-bold text-slate-900">
                  {item.amount > 0 && item.name !== 'Net Take-Home Pay' && item.name !== 'Take-Home Pay' ? '-' : ''}
                  {formatCurrency(item.amount, inputs.currency)}
                </span>
                <span className="text-[10px] font-semibold text-slate-400 w-10 text-right">
                  {formatPercent(item.percentage)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Link */}
        <div className="pt-2 border-t border-slate-100">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700"
          >
            <span>View full breakdown</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <FullBreakdownModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        snapshot={snapshot}
        initialTab="tax"
      />
    </>
  );
};
