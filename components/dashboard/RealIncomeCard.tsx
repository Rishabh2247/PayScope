'use client';

import React, { useState } from 'react';
import { CompleteFinancialSnapshot } from '../../lib/types';
import { formatCurrency, isContractorRole } from '../../lib/formatters';
import { Info, ArrowRight, Pencil } from 'lucide-react';
import { FullBreakdownModal } from './FullBreakdownModal';

import { AnimatedCounter } from '../ui/AnimatedCounter';

interface RealIncomeCardProps {
  snapshot: CompleteFinancialSnapshot;
  onInputsChange?: (newInputs: any) => void;
}

export const RealIncomeCard: React.FC<RealIncomeCardProps> = ({ snapshot, onInputsChange }) => {
  const { tax, economic, inputs } = snapshot;
  const isContractor = isContractorRole(inputs.employmentType);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [customExpenseOffset, setCustomExpenseOffset] = useState(0);

  const monthlyTakeHome = tax.takeHomePayMonthly;
  const colMonthly = economic.colTotalMonthly;
  const fuelMonthly = inputs.country === 'CA' ? 144 : 85.6;

  const totalMonthlyExpenses = Math.max(0, colMonthly + fuelMonthly + customExpenseOffset);
  const disposableMonthly = Math.max(0, monthlyTakeHome - totalMonthlyExpenses);
  const disposablePercentage = monthlyTakeHome > 0 ? Math.round((disposableMonthly / monthlyTakeHome) * 100) : 0;

  return (
    <>
      <div className="bg-white p-5 rounded-3xl border border-[#BFE5D3] shadow-sm flex flex-col justify-between h-full min-h-[380px] space-y-4 overflow-hidden hover:border-[#1F8F68] transition-colors relative animate-fade-in">
        {/* Title & Pen Icon Customizer */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#12372A]">
              {isContractor ? 'Real Net Income After Expenses' : 'Real Income After Expenses'}
            </h3>
            <p className="text-xs text-slate-500">Your financial picture in {economic.cityLabel}</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className="p-1.5 rounded-xl bg-[#F3FBF7] hover:bg-[#EAF7F1] text-[#1F8F68] border border-[#BFE5D3] transition-all cursor-pointer"
              title="Edit Card Values (Pen Icon)"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <Info className="w-4 h-4 text-[#1F8F68] cursor-pointer" />
          </div>
        </div>

        {/* Inline Card Pen Customizer Popover */}
        {isEditMode && (
          <div className="bg-[#F3FBF7] p-3 rounded-2xl border border-[#BFE5D3] space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold text-[#12372A]">
              <span>✏️ Card Customizer:</span>
              <button onClick={() => setIsEditMode(false)} className="text-[10px] text-slate-400 hover:text-slate-600">✕ Close</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-600 block">Monthly Income:</label>
                <input
                  type="number"
                  value={inputs.incomeRate || ''}
                  onChange={(e) => onInputsChange && onInputsChange({ ...inputs, incomeRate: Number(e.target.value) })}
                  className="w-full px-2 py-1 bg-white border border-[#BFE5D3] rounded-md font-bold text-[#12372A]"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-600 block">Custom Expense Offset:</label>
                <input
                  type="number"
                  value={customExpenseOffset}
                  onChange={(e) => setCustomExpenseOffset(Number(e.target.value))}
                  className="w-full px-2 py-1 bg-white border border-[#BFE5D3] rounded-md font-bold text-[#12372A]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Interactive Expense Adjuster */}
        <div className="bg-[#F3FBF7] p-2.5 rounded-2xl border border-[#BFE5D3] space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#12372A]">
            <span>Custom Monthly Expenses:</span>
            <span className="text-[#1F8F68]">${customExpenseOffset > 0 ? `+${customExpenseOffset}` : customExpenseOffset}</span>
          </div>
          <input
            type="range"
            min={-500}
            max={1500}
            step={50}
            value={customExpenseOffset}
            onChange={(e) => setCustomExpenseOffset(Number(e.target.value))}
            className="w-full accent-[#1F8F68] cursor-pointer"
          />
        </div>

        {/* Main Content Split: Left Expenses & Right Visual Gauge */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center flex-1">
          {/* Left Side: Financial Numbers (6 cols) */}
          <div className="sm:col-span-6 space-y-3">
            <div className="space-y-2 text-xs font-semibold">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">
                  {isContractor ? 'Contract Net Take-Home' : 'Take-Home Pay'}
                </span>
                <span className="font-bold text-[#12372A]">
                  <AnimatedCounter value={tax.takeHomePayAnnual} formatter={(val) => formatCurrency(val, inputs.currency)} />
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600">Est. Living Costs</span>
                <span className="font-bold text-rose-500">
                  -<AnimatedCounter value={colMonthly} formatter={(val) => formatCurrency(val, inputs.currency)} />
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600">Est. Fuel & Commute</span>
                <span className="font-bold text-rose-500">
                  -<AnimatedCounter value={fuelMonthly} formatter={(val) => formatCurrency(val, inputs.currency)} />
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#BFE5D3]/60 space-y-0.5">
              <p className="text-xs font-extrabold text-[#1F8F68]">Est. Disposable Income</p>
              <div className="text-2xl sm:text-3xl font-black text-[#1F8F68] tracking-tight">
                <AnimatedCounter value={disposableMonthly} formatter={(val) => formatCurrency(val, inputs.currency)} />
                <span className="text-xs font-semibold text-slate-400"> /month</span>
              </div>
            </div>
          </div>

          {/* Right Side: Perfectly Centered Household Gauge (6 cols) */}
          <div className="sm:col-span-6 h-full min-h-[170px] w-full relative rounded-2xl overflow-hidden bg-[#F3FBF7] border border-[#BFE5D3] flex items-center justify-center p-2">
            <img
              src="/assets/Household Visual.png"
              alt="Household Armchair Visual"
              className="absolute inset-0 w-full h-full object-cover object-center scale-105 opacity-80"
            />
            <div className="absolute inset-0 bg-[#12372A]/10 backdrop-blur-[0.5px]" />

            {/* Centered Circular Gauge */}
            <div className="relative z-10 w-28 h-28 rounded-full bg-white/95 backdrop-blur-md border-4 border-[#1F8F68] flex flex-col items-center justify-center shadow-lg text-center p-1.5">
              <span className="text-2xl font-black text-[#12372A] leading-none">
                {disposablePercentage}%
              </span>
              <span className="text-[9px] font-bold text-[#1F8F68] leading-tight mt-1 px-1">
                disposable pay after expenses
              </span>
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <div className="flex items-center justify-between border-t border-[#BFE5D3]/60 pt-3 text-xs">
          <button
            onClick={() => setIsModalOpen(true)}
            className="font-bold text-[#1F8F68] hover:text-[#176F52] inline-flex items-center gap-1"
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
        initialTab="all"
      />
    </>
  );
};
