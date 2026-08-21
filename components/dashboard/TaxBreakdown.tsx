'use client';

import React, { useState } from 'react';
import { CompleteFinancialSnapshot } from '../../lib/types';
import { formatCurrency, formatPercent, isContractorRole } from '../../lib/formatters';
import { ArrowRight, Pencil } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { FullBreakdownModal } from './FullBreakdownModal';

interface TaxBreakdownProps {
  snapshot: CompleteFinancialSnapshot;
  onInputsChange?: (newInputs: any) => void;
}

export const TaxBreakdown: React.FC<TaxBreakdownProps> = ({ snapshot, onInputsChange }) => {
  const { tax, inputs } = snapshot;
  const isContractor = isContractorRole(inputs.employmentType);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const formatTaxName = (name: string) => {
    if (name.includes('Provincial Tax')) return 'Provincial Tax';
    if (name.includes('State Tax')) return 'State Tax';
    return name;
  };

  const data = tax.breakdown.map((item) => ({
    name: formatTaxName(item.name),
    value: Math.max(0, item.amount),
    color: item.name.includes('Take-Home') ? '#1F8F68' : item.color,
    percentage: item.percentage,
  }));

  return (
    <>
      <div className="bg-white dark:bg-[#101512] p-5 rounded-3xl border border-[#BFE5D3] dark:border-[#26302A] shadow-sm flex flex-col justify-between h-full space-y-4 hover:border-[#1F8F68] dark:hover:border-[#22C55E]/50 transition-colors relative">
        {/* Title & Pen Icon Customizer */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#12372A] dark:text-[#F9FAFB]">
              {isContractor ? 'Contract Revenue Breakdown' : 'Take-Home Pay Breakdown'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isContractor ? 'Where contract revenue goes' : 'Where your money goes'}
            </p>
          </div>

          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className="p-1.5 rounded-xl bg-[#F3FBF7] dark:bg-[#151C17] hover:bg-[#EAF7F1] dark:hover:bg-[#1C251F] text-[#1F8F68] dark:text-[#22C55E] border border-[#BFE5D3] dark:border-[#26302A] transition-all cursor-pointer"
            title="Edit Tax Card Values (Pen Icon)"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>

        {/* Inline Card Pen Customizer Popover */}
        {isEditMode && (
          <div className="bg-[#F3FBF7] dark:bg-[#151C17] p-3 rounded-2xl border border-[#BFE5D3] dark:border-[#26302A] space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold text-[#12372A] dark:text-[#F9FAFB]">
              <span>✏️ Tax Customizer:</span>
              <button onClick={() => setIsEditMode(false)} className="text-[10px] text-slate-400 hover:text-slate-600">✕ Close</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block">Gross Rate:</label>
                <input
                  type="number"
                  value={inputs.incomeRate || ''}
                  onChange={(e) => onInputsChange && onInputsChange({ ...inputs, incomeRate: Number(e.target.value) })}
                  className="w-full px-2 py-1 bg-white dark:bg-[#101512] border border-[#BFE5D3] dark:border-[#26302A] rounded-md font-bold text-[#12372A] dark:text-[#F9FAFB]"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block">{isContractor ? 'Write-off (%)' : '401(k) (%)'}:</label>
                <input
                  type="number"
                  value={inputs.k401Contribution || 0}
                  onChange={(e) => onInputsChange && onInputsChange({ ...inputs, k401Contribution: Number(e.target.value) })}
                  className="w-full px-2 py-1 bg-white dark:bg-[#101512] border border-[#BFE5D3] dark:border-[#26302A] rounded-md font-bold text-[#12372A] dark:text-[#F9FAFB]"
                />
              </div>
            </div>
          </div>
        )}

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
            <span className="text-sm font-black text-[#12372A] dark:text-[#F9FAFB]">
              {formatCurrency(tax.grossIncome, inputs.currency, true)}
            </span>
            <span className="text-[10px] text-[#1F8F68] dark:text-[#22C55E] font-bold uppercase tracking-wider">
              {isContractor ? 'Contract Revenue' : 'Gross Income'}
            </span>
          </div>
        </div>

        {/* Itemized List */}
        <div className="space-y-1.5 text-xs">
          {tax.breakdown.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.name.includes('Take-Home') ? '#1F8F68' : item.color }}
                />
                <span className="font-semibold text-[#12372A] dark:text-[#F9FAFB] truncate">{formatTaxName(item.name)}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-bold text-[#12372A] dark:text-[#F9FAFB]">
                  {item.amount > 0 && item.name !== 'Net Take-Home Pay' && item.name !== 'Take-Home Pay' ? '-' : ''}
                  {formatCurrency(item.amount, inputs.currency)}
                </span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 w-10 text-right">
                  {formatPercent(item.percentage)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Link */}
        <div className="pt-2 border-t border-[#BFE5D3]/60 dark:border-[#26302A] flex items-center justify-between">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#1F8F68] dark:text-[#22C55E] hover:text-[#176F52] dark:hover:text-[#16A34A]"
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
