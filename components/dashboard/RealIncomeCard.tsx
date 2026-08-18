'use client';

import React, { useState } from 'react';
import { CompleteFinancialSnapshot } from '../../lib/types';
import { formatCurrency, isContractorRole } from '../../lib/formatters';
import { Info, ArrowRight } from 'lucide-react';
import { FullBreakdownModal } from './FullBreakdownModal';

interface RealIncomeCardProps {
  snapshot: CompleteFinancialSnapshot;
}

export const RealIncomeCard: React.FC<RealIncomeCardProps> = ({ snapshot }) => {
  const { tax, economic, inputs } = snapshot;
  const isContractor = isContractorRole(inputs.employmentType);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const monthlyTakeHome = tax.takeHomePayMonthly;
  const colMonthly = economic.colTotalMonthly;
  const fuelMonthly = inputs.country === 'CA' ? 144 : 85.6;

  const totalMonthlyExpenses = colMonthly + fuelMonthly;
  const disposableMonthly = Math.max(0, monthlyTakeHome - totalMonthlyExpenses);
  const disposablePercentage = monthlyTakeHome > 0 ? Math.round((disposableMonthly / monthlyTakeHome) * 100) : 0;

  return (
    <>
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between h-full min-h-[380px] space-y-4 overflow-hidden">
        {/* Title */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isContractor ? 'Real Net Income After Expenses' : 'Real Income After Expenses'}
            </h3>
            <p className="text-xs text-slate-400">Your financial picture in {economic.cityLabel}</p>
          </div>
          <Info className="w-4 h-4 text-slate-400 cursor-pointer shrink-0" />
        </div>

        {/* Main Content Split: Left Expenses & Right Armchair Visual Card */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center flex-1">
          {/* Left Side: Financial Numbers (6 cols) */}
          <div className="sm:col-span-6 space-y-3">
            <div className="space-y-2 text-xs font-semibold">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">
                  {isContractor ? 'Contract Net Take-Home' : 'Take-Home Pay'}
                </span>
                <span className="font-bold text-slate-900">
                  {formatCurrency(tax.takeHomePayAnnual, inputs.currency)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600">Est. Living Costs</span>
                <span className="font-bold text-rose-500">
                  -{formatCurrency(colMonthly, inputs.currency)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600">Est. Fuel & Commute</span>
                <span className="font-bold text-rose-500">
                  -{formatCurrency(fuelMonthly, inputs.currency)}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-0.5">
              <p className="text-xs font-bold text-emerald-600">Est. Disposable Income</p>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">
                {formatCurrency(disposableMonthly, inputs.currency)}
                <span className="text-xs font-semibold text-slate-400"> /month</span>
              </div>
            </div>
          </div>

          {/* Right Side: Perfectly Centered Armchair Visual Container (6 cols) */}
          <div className="sm:col-span-6 h-full min-h-[170px] w-full relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/60 flex items-center justify-center p-2">
            {/* Armchair Background Image - Centered and fit cleanly */}
            <img
              src="/assets/Household Visual.png"
              alt="Household Armchair Visual"
              className="absolute inset-0 w-full h-full object-cover object-center scale-105"
            />
            {/* Soft overlay for contrast */}
            <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[0.5px]" />

            {/* Centered Circular Gauge */}
            <div className="relative z-10 w-28 h-28 rounded-full bg-white/95 backdrop-blur-md border-4 border-emerald-500 flex flex-col items-center justify-center shadow-lg text-center p-1.5">
              <span className="text-2xl font-black text-slate-900 leading-none">
                {disposablePercentage}%
              </span>
              <span className="text-[9px] font-bold text-slate-500 leading-tight mt-1 px-1">
                of take-home pay left after expenses
              </span>
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
          <button
            onClick={() => setIsModalOpen(true)}
            className="font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
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
